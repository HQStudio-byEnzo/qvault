import { f as defineEventHandler, B as requireAuth, F as useDB, r as getRouterParam, A as readBody, c as createError } from '../../../nitro/nitro.mjs';
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

const _id__put = defineEventHandler(async (event) => {
  const session = await requireAuth(event);
  const db = useDB();
  const id = getRouterParam(event, "id");
  const body = await readBody(event);
  if (!id) {
    throw createError({ statusCode: 400, message: "ID requis." });
  }
  const existing = await db.execute({
    sql: "SELECT id FROM vault_items WHERE id = ? AND user_id = ?",
    args: [id, session.user.id]
  });
  if (existing.rows.length === 0) {
    throw createError({ statusCode: 404, message: "\xC9l\xE9ment non trouv\xE9." });
  }
  const updates = [];
  const params = [];
  if (body.label !== void 0) {
    updates.push("label = ?");
    params.push(body.label);
  }
  if (body.payload !== void 0) {
    updates.push("payload = ?");
    params.push(body.payload);
  }
  if (body.iv !== void 0) {
    updates.push("iv = ?");
    params.push(body.iv);
  }
  if (body.is_encrypted !== void 0) {
    updates.push("is_encrypted = ?");
    params.push(body.is_encrypted ? 1 : 0);
  }
  if (body.favorite !== void 0) {
    updates.push("favorite = ?");
    params.push(body.favorite ? 1 : 0);
  }
  if (updates.length === 0) {
    throw createError({ statusCode: 400, message: "Aucune modification fournie." });
  }
  updates.push("updated_at = datetime('now')");
  params.push(id, session.user.id);
  await db.execute({
    sql: `UPDATE vault_items SET ${updates.join(", ")} WHERE id = ? AND user_id = ?`,
    args: params
  });
  return { message: "\xC9l\xE9ment mis \xE0 jour." };
});

export { _id__put as default };
//# sourceMappingURL=_id_.put.mjs.map
