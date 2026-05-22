import __nuxt_component_1 from './index-4t8XY1h8.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-DmOlchq5.mjs';
import { defineComponent, mergeProps, unref, withCtx, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { f as useAuthClient } from './server.mjs';
import { u as useVault } from './useVault--imhJMK4.mjs';
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
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuthClient();
    const { stats } = useVault();
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d, _e;
      const _component_Icon = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-6 lg:p-8 max-w-6xl mx-auto space-y-8" }, _attrs))}><div><h1 class="text-2xl font-bold text-white">Tableau de bord</h1><p class="text-surface-400 mt-1">Bienvenue, ${ssrInterpolate((_a = unref(user)) == null ? void 0 : _a.name)}. Voici un aper\xE7u de votre coffre-fort.</p></div><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"><div class="card"><div class="flex items-center justify-between mb-3">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:link",
        class: "w-5 h-5 text-blue-400"
      }, null, _parent));
      _push(`<span class="text-xs text-surface-500">Illimit\xE9</span></div><p class="text-2xl font-bold text-white">${ssrInterpolate(((_b = unref(stats)) == null ? void 0 : _b.counts.links) || 0)}</p><p class="text-sm text-surface-400">Liens</p></div><div class="card"><div class="flex items-center justify-between mb-3">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:key-round",
        class: "w-5 h-5 text-amber-400"
      }, null, _parent));
      _push(`<span class="text-xs text-surface-500">Illimit\xE9</span></div><p class="text-2xl font-bold text-white">${ssrInterpolate(((_c = unref(stats)) == null ? void 0 : _c.counts.passwords) || 0)}</p><p class="text-sm text-surface-400">Mots de passe</p></div><div class="card"><div class="flex items-center justify-between mb-3">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:bitcoin",
        class: "w-5 h-5 text-orange-400"
      }, null, _parent));
      _push(`<span class="text-xs text-surface-500">Illimit\xE9</span></div><p class="text-2xl font-bold text-white">${ssrInterpolate(((_d = unref(stats)) == null ? void 0 : _d.counts.crypto) || 0)}</p><p class="text-sm text-surface-400">Crypto</p></div><div class="card"><div class="flex items-center justify-between mb-3">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:star",
        class: "w-5 h-5 text-yellow-400"
      }, null, _parent));
      _push(`</div><p class="text-2xl font-bold text-white">${ssrInterpolate(((_e = unref(stats)) == null ? void 0 : _e.counts.favorites) || 0)}</p><p class="text-sm text-surface-400">Favoris</p></div></div><div><h2 class="text-lg font-semibold text-white mb-4">Actions rapides</h2><div class="grid grid-cols-1 sm:grid-cols-3 gap-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/links",
        class: "card-hover flex items-center gap-3"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "lucide:plus",
              class: "w-5 h-5 text-blue-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><span class="text-sm font-medium text-surface-200"${_scopeId}>Ajouter un lien</span>`);
          } else {
            return [
              createVNode("div", { class: "w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center" }, [
                createVNode(_component_Icon, {
                  name: "lucide:plus",
                  class: "w-5 h-5 text-blue-400"
                })
              ]),
              createVNode("span", { class: "text-sm font-medium text-surface-200" }, "Ajouter un lien")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/passwords",
        class: "card-hover flex items-center gap-3"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "lucide:plus",
              class: "w-5 h-5 text-amber-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><span class="text-sm font-medium text-surface-200"${_scopeId}>Ajouter un mot de passe</span>`);
          } else {
            return [
              createVNode("div", { class: "w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center" }, [
                createVNode(_component_Icon, {
                  name: "lucide:plus",
                  class: "w-5 h-5 text-amber-400"
                })
              ]),
              createVNode("span", { class: "text-sm font-medium text-surface-200" }, "Ajouter un mot de passe")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard/crypto",
        class: "card-hover flex items-center gap-3"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "lucide:plus",
              class: "w-5 h-5 text-orange-400"
            }, null, _parent2, _scopeId));
            _push2(`</div><span class="text-sm font-medium text-surface-200"${_scopeId}>Ajouter une cl\xE9 crypto</span>`);
          } else {
            return [
              createVNode("div", { class: "w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center" }, [
                createVNode(_component_Icon, {
                  name: "lucide:plus",
                  class: "w-5 h-5 text-orange-400"
                })
              ]),
              createVNode("span", { class: "text-sm font-medium text-surface-200" }, "Ajouter une cl\xE9 crypto")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-D2a3-yOv.mjs.map
