// Test de l'envoi hors site : signature SigV4 et envoi/lecture S3.
//
// 1. Reproductibilité de la signature avec le vecteur officiel AWS (get-vanilla).
// 2. Stabilité de la signature et sensibilité au corps.
// 3. Envoi et vérification distante sur un fetch simulé, sans réseau.
import { createHash } from 'node:crypto'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { r2Config, signRequest, uploadBackup, verifyRemote } from './r2-lib.mjs'

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

// Vecteur AWS : https://docs.aws.amazon.com/IAM/latest/UserGuide/create-signed-request.html
const aws = signRequest({
  method: 'GET',
  url: 'https://example.amazonaws.com/',
  accessKeyId: 'AKIDEXAMPLE',
  secretAccessKey: 'wJalrXUtnFEMI/K7MDENG+bPxRfiCYEXAMPLEKEY',
  region: 'us-east-1',
  service: 'service',
  date: new Date('2015-08-30T12:36:00Z'),
  includeContentSha256: false,
})
assert(
  aws.Authorization ===
    'AWS4-HMAC-SHA256 Credential=AKIDEXAMPLE/20150830/us-east-1/service/aws4_request, ' +
      'SignedHeaders=host;x-amz-date, ' +
      'Signature=5fa00fa31553b73ebf1942676e86291e8372ff2a2260956d9b8aae1d763fbf31',
  `Signature AWS non conforme : ${aws.Authorization}`,
)

const config = {
  accountId: 'abc123',
  bucket: 'qvault-backups',
  accessKeyId: 'AKIDEXAMPLE',
  secretAccessKey: 'secret',
  prefix: 'qvault/',
  configured: true,
}
const fixedDate = new Date('2026-10-27T03:00:00Z')
const payload = Buffer.from('{"format":"qvault-backup/1"}')
const sign = (body, method = 'PUT') =>
  signRequest({
    method,
    url: 'https://qvault-backups.abc123.r2.cloudflarestorage.com/qvault/qvault-2026-10-27T03-00-00Z.json.gz.enc',
    body,
    accessKeyId: config.accessKeyId,
    secretAccessKey: config.secretAccessKey,
    date: fixedDate,
  }).Authorization

const first = sign(payload)
assert(first === sign(payload), 'Signature instable pour une même requête')
assert(first !== sign(Buffer.from('autre contenu')), 'Signature insensible au corps')
assert(first.includes('Credential=AKIDEXAMPLE/20261027/auto/s3/aws4_request'), 'Portée de signature inattendue')
assert(first.includes('host;x-amz-content-sha256;x-amz-date'), 'En-têtes signés inattendus')

// Configuration : absente par défaut, complète avec les quatre variables.
assert(r2Config({}).configured === false, 'R2 considéré configuré sans variables')
assert(
  r2Config({
    QVAULT_R2_ACCOUNT_ID: 'abc123',
    QVAULT_R2_BUCKET: 'qvault-backups',
    QVAULT_R2_ACCESS_KEY_ID: 'id',
    QVAULT_R2_SECRET_ACCESS_KEY: 'secret',
  }).configured === true,
  'Configuration R2 complète refusée',
)

const workspace = mkdtempSync(join(tmpdir(), 'qvault-r2-'))
try {
  const file = join(workspace, 'qvault-2026-10-27T03-00-00Z.json.gz.enc')
  writeFileSync(file, payload)

  const calls = []
  const store = new Map()
  const fakeFetch = async (url, options) => {
    calls.push({ url, method: options.method })
    if (options.method === 'PUT') {
      store.set(url, Buffer.from(options.body))
      return new Response(null, { status: 200, headers: { etag: '"abc"' } })
    }
    const value = store.get(url)
    if (!value) return new Response('not found', { status: 404 })
    return new Response(value, { status: 200 })
  }

  const uploaded = await uploadBackup(file, config, { fetchImpl: fakeFetch })
  assert(calls[0].method === 'PUT', 'Envoi hors site n’utilise pas PUT')
  assert(uploaded.key === 'qvault-2026-10-27T03-00-00Z.json.gz.enc', `Nom d’objet inattendu : ${uploaded.key}`)
  assert(
    calls[0].url === 'https://qvault-backups.abc123.r2.cloudflarestorage.com/qvault/qvault-2026-10-27T03-00-00Z.json.gz.enc',
    `URL d’envoi inattendue : ${calls[0].url}`,
  )

  const remote = await verifyRemote(file, config, { fetchImpl: fakeFetch })
  assert(remote.sha256 === createHash('sha256').update(payload).digest('hex'), 'Empreinte distante incorrecte')

  // Un objet altéré doit être détecté.
  for (const [url] of store) store.set(url, Buffer.from('corrompu'))
  let tamperDetected = false
  try {
    await verifyRemote(file, config, { fetchImpl: fakeFetch })
  } catch {
    tamperDetected = true
  }
  assert(tamperDetected, 'Objet distant altéré non détecté')

  // Un refus du stockage remonte une erreur explicite.
  let refusalReported = false
  try {
    await uploadBackup(file, config, { fetchImpl: async () => new Response('denied', { status: 403 }) })
  } catch (error) {
    refusalReported = /403/.test(error.message)
  }
  assert(refusalReported, 'Refus du stockage non signalé')

  console.log(JSON.stringify({
    ok: true,
    awsVector: true,
    signatureStable: true,
    signatureBodySensitive: true,
    configDetection: true,
    uploadPut: true,
    remoteHash: true,
    tamperDetected: true,
    refusalReported: true,
  }))
} finally {
  rmSync(workspace, { recursive: true, force: true })
}
