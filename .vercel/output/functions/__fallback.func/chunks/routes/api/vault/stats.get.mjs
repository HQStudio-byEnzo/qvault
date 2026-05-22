import { f as defineEventHandler, B as requireAuth, F as useDB } from '../../../nitro/nitro.mjs';
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

const stats_get = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e, _f, _g;
  const session = await requireAuth(event);
  const db = useDB();
  const [links, passwords, crypto, favorites] = await Promise.all([
    db.execute({ sql: "SELECT COUNT(*) as count FROM vault_items WHERE user_id = ? AND type = ?", args: [session.user.id, "link"] }),
    db.execute({ sql: "SELECT COUNT(*) as count FROM vault_items WHERE user_id = ? AND type = ?", args: [session.user.id, "password"] }),
    db.execute({ sql: "SELECT COUNT(*) as count FROM vault_items WHERE user_id = ? AND type = ?", args: [session.user.id, "crypto"] }),
    db.execute({ sql: "SELECT COUNT(*) as count FROM vault_items WHERE user_id = ? AND favorite = 1", args: [session.user.id] })
  ]);
  return {
    counts: {
      links: Number((_a = links.rows[0]) == null ? void 0 : _a.count) || 0,
      passwords: Number((_b = passwords.rows[0]) == null ? void 0 : _b.count) || 0,
      crypto: Number((_c = crypto.rows[0]) == null ? void 0 : _c.count) || 0,
      favorites: Number((_d = favorites.rows[0]) == null ? void 0 : _d.count) || 0,
      total: (Number((_e = links.rows[0]) == null ? void 0 : _e.count) || 0) + (Number((_f = passwords.rows[0]) == null ? void 0 : _f.count) || 0) + (Number((_g = crypto.rows[0]) == null ? void 0 : _g.count) || 0)
    }
  };
});

export { stats_get as default };
//# sourceMappingURL=stats.get.mjs.map
