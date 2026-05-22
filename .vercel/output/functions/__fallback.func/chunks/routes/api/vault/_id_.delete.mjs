import { f as defineEventHandler, B as requireAuth, F as useDB, r as getRouterParam, c as createError } from '../../../nitro/nitro.mjs';
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

const _id__delete = defineEventHandler(async (event) => {
  const session = await requireAuth(event);
  const db = useDB();
  const id = getRouterParam(event, "id");
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
  await db.execute({
    sql: "DELETE FROM vault_items WHERE id = ? AND user_id = ?",
    args: [id, session.user.id]
  });
  return { message: "\xC9l\xE9ment supprim\xE9." };
});

export { _id__delete as default };
//# sourceMappingURL=_id_.delete.mjs.map
