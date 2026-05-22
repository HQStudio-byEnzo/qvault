import __nuxt_component_1 from './index-4t8XY1h8.mjs';
import { defineComponent, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { f as useAuthClient } from './server.mjs';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import './v3-D_1QdVRM.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import '../nitro/nitro.mjs';
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
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'perfect-debounce';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "settings",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuthClient();
    function formatDate(date) {
      if (!date) return "\u2014";
      return new Date(date).toLocaleDateString("fr-FR", {
        year: "numeric",
        month: "long",
        day: "numeric"
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c;
      const _component_Icon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-6 lg:p-8 max-w-3xl mx-auto space-y-8" }, _attrs))}><div><h1 class="text-2xl font-bold text-white">Param\xE8tres</h1><p class="text-surface-400 text-sm mt-1">G\xE9rez votre compte</p></div><section class="card space-y-4"><h2 class="text-lg font-semibold text-white flex items-center gap-2">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:user",
        class: "w-5 h-5 text-surface-400"
      }, null, _parent));
      _push(` Compte </h2><div class="space-y-3"><div class="flex items-center justify-between py-2 border-b border-surface-800"><span class="text-sm text-surface-400">Nom</span><span class="text-sm text-surface-200">${ssrInterpolate((_a = unref(user)) == null ? void 0 : _a.name)}</span></div><div class="flex items-center justify-between py-2 border-b border-surface-800"><span class="text-sm text-surface-400">Email</span><span class="text-sm text-surface-200">${ssrInterpolate((_b = unref(user)) == null ? void 0 : _b.email)}</span></div><div class="flex items-center justify-between py-2"><span class="text-sm text-surface-400">Membre depuis</span><span class="text-sm text-surface-200">${ssrInterpolate(formatDate((_c = unref(user)) == null ? void 0 : _c.created_at))}</span></div></div></section><section class="card space-y-4"><h2 class="text-lg font-semibold text-white flex items-center gap-2">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:shield",
        class: "w-5 h-5 text-surface-400"
      }, null, _parent));
      _push(` S\xE9curit\xE9 </h2><div class="p-4 rounded-lg bg-surface-800 border border-surface-700"><p class="text-sm text-surface-400 leading-relaxed"> Kipit utilise un chiffrement <strong class="text-surface-200">AES-256-GCM</strong> c\xF4t\xE9 client. Vos donn\xE9es chiffr\xE9es ne sont jamais lisibles par nos serveurs. Assurez-vous de ne jamais oublier votre mot de passe ma\xEEtre \u2014 il est impossible de r\xE9cup\xE9rer des donn\xE9es chiffr\xE9es sans lui. </p></div></section><section class="card border-red-500/20 space-y-4"><h2 class="text-lg font-semibold text-red-400 flex items-center gap-2">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:alert-triangle",
        class: "w-5 h-5"
      }, null, _parent));
      _push(` Zone dangereuse </h2><button class="btn-danger flex items-center gap-2">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:log-out",
        class: "w-4 h-4"
      }, null, _parent));
      _push(` Se d\xE9connecter </button></section></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/settings.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=settings-DCfvxFN3.mjs.map
