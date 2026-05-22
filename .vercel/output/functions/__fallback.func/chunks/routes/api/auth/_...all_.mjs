import { f as defineEventHandler, E as useAuth, D as toWebRequest } from '../../../nitro/nitro.mjs';
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

const ____all_ = defineEventHandler(async (event) => {
  const auth = useAuth();
  return auth.handler(toWebRequest(event));
});

export { ____all_ as default };
//# sourceMappingURL=_...all_.mjs.map
