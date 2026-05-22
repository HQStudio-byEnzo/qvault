import { f as defineEventHandler, B as requireAuth, F as useDB, A as readBody, c as createError } from '../../nitro/nitro.mjs';
import 'better-auth';
import '@libsql/client';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import '@iconify/utils';
import 'consola';

const index_post = defineEventHandler(async (event) => {
  const session = await requireAuth(event);
  const db = useDB();
  const body = await readBody(event);
  const { type, label, is_encrypted, payload, iv } = body;
  if (!type || !["link", "password", "crypto"].includes(type)) {
    throw createError({
      statusCode: 400,
      message: "Type invalide. Doit \xEAtre: link, password, ou crypto."
    });
  }
  if (!payload) {
    throw createError({
      statusCode: 400,
      message: "Le payload est requis."
    });
  }
  if (is_encrypted && !iv) {
    throw createError({
      statusCode: 400,
      message: "Le vecteur d'initialisation (iv) est requis pour les \xE9l\xE9ments chiffr\xE9s."
    });
  }
  const id = crypto.randomUUID();
  await db.execute({
    sql: "INSERT INTO vault_items (id, user_id, type, label, is_encrypted, payload, iv, favorite, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, 0, datetime('now'), datetime('now'))",
    args: [id, session.user.id, type, label || "", is_encrypted ? 1 : 0, payload, iv || null]
  });
  return {
    id,
    message: "\xC9l\xE9ment ajout\xE9 avec succ\xE8s."
  };
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
