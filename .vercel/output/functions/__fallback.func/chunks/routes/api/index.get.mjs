import { f as defineEventHandler, B as requireAuth, F as useDB, m as getQuery } from '../../nitro/nitro.mjs';
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

const index_get = defineEventHandler(async (event) => {
  const session = await requireAuth(event);
  const db = useDB();
  const query = getQuery(event);
  const type = query.type;
  const search = query.search;
  const favorites = query.favorites === "true";
  let sql = "SELECT * FROM vault_items WHERE user_id = ?";
  const params = [session.user.id];
  if (type && ["link", "password", "crypto"].includes(type)) {
    sql += " AND type = ?";
    params.push(type);
  }
  if (favorites) {
    sql += " AND favorite = 1";
  }
  if (search) {
    sql += " AND (label LIKE ? OR (is_encrypted = 0 AND payload LIKE ?))";
    params.push(`%${search}%`, `%${search}%`);
  }
  sql += " ORDER BY favorite DESC, created_at DESC";
  const result = await db.execute({ sql, args: params });
  return {
    items: result.rows,
    count: result.rows.length
  };
});

export { index_get as default };
//# sourceMappingURL=index.get.mjs.map
