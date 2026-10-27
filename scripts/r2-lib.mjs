// Envoi des sauvegardes chiffrées vers un stockage S3-compatible, prévu pour
// Cloudflare R2. Aucune dépendance : signature AWS SigV4 calculée avec node:crypto.
//
// Variables attendues :
//   QVAULT_R2_ACCOUNT_ID / QVAULT_R2_BUCKET
//   QVAULT_R2_ACCESS_KEY_ID / QVAULT_R2_SECRET_ACCESS_KEY
//   QVAULT_R2_PREFIX (défaut: qvault/)
import { createHash, createHmac } from 'node:crypto'
import { readFileSync } from 'node:fs'

const BUCKET_HOST_SUFFIX = '.r2.cloudflarestorage.com'

function sha256hex(data) {
  return createHash('sha256').update(data).digest('hex')
}

function hmac(key, data) {
  return createHmac('sha256', key).update(data).digest()
}

/** Signature AWS Signature Version 4. Renvoie les en-têtes à envoyer. */
export function signRequest({
  method,
  url,
  headers = {},
  body = Buffer.alloc(0),
  accessKeyId,
  secretAccessKey,
  region = 'auto',
  service = 's3',
  date = new Date(),
  includeContentSha256 = true,
}) {
  const parsed = new URL(url)
  const amzDate = date.toISOString().replace(/[:-]|\.\d{3}/g, '')
  const dateStamp = amzDate.slice(0, 8)
  const payloadHash = sha256hex(body)

  const base = {
    host: parsed.host,
    ...(includeContentSha256 ? { 'x-amz-content-sha256': payloadHash } : {}),
    'x-amz-date': amzDate,
    ...headers,
  }
  const lower = Object.fromEntries(Object.entries(base).map(([key, value]) => [key.toLowerCase(), String(value).trim()]))
  const signedHeaders = Object.keys(lower).sort()
  const canonicalHeaders = signedHeaders.map(name => `${name}:${lower[name]}\n`).join('')
  const canonicalQuery = [...parsed.searchParams.entries()]
    .map(([key, value]) => [encodeURIComponent(key), encodeURIComponent(value)])
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([key, value]) => `${key}=${value}`)
    .join('&')
  const canonicalRequest = [
    method.toUpperCase(),
    parsed.pathname,
    canonicalQuery,
    canonicalHeaders,
    signedHeaders.join(';'),
    payloadHash,
  ].join('\n')

  const scope = `${dateStamp}/${region}/${service}/aws4_request`
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, scope, sha256hex(canonicalRequest)].join('\n')

  let signingKey = hmac(`AWS4${secretAccessKey}`, dateStamp)
  signingKey = hmac(signingKey, region)
  signingKey = hmac(signingKey, service)
  signingKey = hmac(signingKey, 'aws4_request')
  const signature = createHmac('sha256', signingKey).update(stringToSign).digest('hex')

  return {
    ...base,
    Authorization: `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${scope}, SignedHeaders=${signedHeaders.join(';')}, Signature=${signature}`,
  }
}

export function r2Config(env = process.env) {
  const accountId = String(env.QVAULT_R2_ACCOUNT_ID || '').trim()
  const bucket = String(env.QVAULT_R2_BUCKET || '').trim()
  const accessKeyId = String(env.QVAULT_R2_ACCESS_KEY_ID || '').trim()
  const secretAccessKey = String(env.QVAULT_R2_SECRET_ACCESS_KEY || '').trim()
  const prefix = String(env.QVAULT_R2_PREFIX ?? 'qvault/').trim()
  const configured = Boolean(accountId && bucket && accessKeyId && secretAccessKey)
  return { accountId, bucket, accessKeyId, secretAccessKey, prefix, configured }
}

function objectUrl(config, key) {
  const cleanPrefix = config.prefix ? `${config.prefix.replace(/^\/+|\/+$/g, '')}/` : ''
  const encoded = `${cleanPrefix}${key}`.split('/').map(encodeURIComponent).join('/')
  return `https://${config.bucket}.${config.accountId}${BUCKET_HOST_SUFFIX}/${encoded}`
}

/** Envoie un fichier local dans le bucket. Renvoie la clé et l'ETag. */
export async function uploadBackup(path, config, { fetchImpl = fetch } = {}) {
  if (!config.configured) throw new Error('Configuration R2 incomplète')
  const body = readFileSync(path)
  const key = path.split('/').pop()
  const url = objectUrl(config, key)
  const headers = signRequest({
    method: 'PUT',
    url,
    body,
    headers: { 'content-type': 'application/octet-stream', 'content-length': String(body.length) },
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  })
  const response = await fetchImpl(url, { method: 'PUT', headers, body })
  if (!response.ok) {
    const detail = (await response.text().catch(() => '')).slice(0, 300)
    throw new Error(`R2 a refusé l'envoi (${response.status}) : ${detail}`)
  }
  return { key, path: url, bytes: body.length, etag: response.headers.get('etag') ?? null }
}

/** Relit l'objet distant et compare son empreinte à celle du fichier local. */
export async function verifyRemote(path, config, { fetchImpl = fetch } = {}) {
  if (!config.configured) throw new Error('Configuration R2 incomplète')
  const key = path.split('/').pop()
  const url = objectUrl(config, key)
  const headers = signRequest({
    method: 'GET',
    url,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
  })
  const response = await fetchImpl(url, { method: 'GET', headers })
  if (!response.ok) throw new Error(`Objet distant illisible (${response.status}) : ${key}`)
  const remote = Buffer.from(await response.arrayBuffer())
  const local = readFileSync(path)
  if (remote.length !== local.length) {
    throw new Error(`Taille distante ${remote.length} ≠ locale ${local.length} pour ${key}`)
  }
  const remoteHash = sha256hex(remote)
  if (remoteHash !== sha256hex(local)) throw new Error(`Empreinte distante différente pour ${key}`)
  return { key, bytes: remote.length, sha256: remoteHash }
}
