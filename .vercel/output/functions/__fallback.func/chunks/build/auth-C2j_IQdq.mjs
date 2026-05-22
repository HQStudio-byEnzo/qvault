import { k as executeAsync } from '../nitro/nitro.mjs';
import { d as defineNuxtRouteMiddleware, f as useAuthClient, n as navigateTo } from './server.mjs';
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
import 'vue';
import 'vue-router';
import '@iconify/vue';
import 'vue/server-renderer';

const auth = defineNuxtRouteMiddleware(async (to) => {
  let __temp, __restore;
  const { user, fetchSession, loading } = useAuthClient();
  if (!user.value && loading.value) {
    [__temp, __restore] = executeAsync(() => fetchSession()), await __temp, __restore();
  }
  if (!user.value) {
    return navigateTo("/auth/login");
  }
});

export { auth as default };
//# sourceMappingURL=auth-C2j_IQdq.mjs.map
