import __nuxt_component_1 from './index-4t8XY1h8.mjs';
import { _ as __nuxt_component_0 } from './nuxt-link-DmOlchq5.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import './server.mjs';
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
import 'vue-router';
import './v3-D_1QdVRM.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'perfect-debounce';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_1;
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex flex-col" }, _attrs))}><header class="h-16 flex items-center justify-between px-6 border-b border-surface-800"><div class="flex items-center gap-2"><div class="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:shield",
        class: "w-5 h-5 text-white"
      }, null, _parent));
      _push(`</div><span class="text-lg font-semibold text-white">Kipit</span></div><div class="flex items-center gap-3">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/login",
        class: "btn-secondary text-sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Se connecter `);
          } else {
            return [
              createTextVNode(" Se connecter ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/register",
        class: "btn-primary text-sm"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Commencer gratuitement `);
          } else {
            return [
              createTextVNode(" Commencer gratuitement ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></header><main class="flex-1 flex items-center justify-center px-6"><div class="max-w-3xl text-center space-y-8 animate-fade-in"><div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-surface-700 bg-surface-900 text-xs font-medium text-surface-300">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:lock",
        class: "w-3 h-3 text-accent-400"
      }, null, _parent));
      _push(` Chiffrement Zero-Knowledge </div><h1 class="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight"> Votre coffre-fort<br><span class="text-accent-400">num\xE9rique s\xE9curis\xE9</span></h1><p class="text-lg md:text-xl text-surface-400 max-w-xl mx-auto leading-relaxed"> Stockez vos liens, mots de passe et cl\xE9s crypto en toute s\xE9curit\xE9. Chiffrement AES-256 c\xF4t\xE9 client \u2014 m\xEAme nous ne pouvons pas lire vos donn\xE9es. </p><div class="flex flex-col sm:flex-row items-center justify-center gap-4">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/register",
        class: "btn-primary text-base px-6 py-3"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Cr\xE9er un compte gratuit `);
          } else {
            return [
              createTextVNode(" Cr\xE9er un compte gratuit ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/login",
        class: "btn-secondary text-base px-6 py-3"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` J&#39;ai d\xE9j\xE0 un compte `);
          } else {
            return [
              createTextVNode(" J'ai d\xE9j\xE0 un compte ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="grid grid-cols-1 md:grid-cols-3 gap-4 pt-12"><div class="card text-left">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:link",
        class: "w-8 h-8 text-accent-400 mb-3"
      }, null, _parent));
      _push(`<h3 class="font-semibold text-white mb-1">Liens</h3><p class="text-sm text-surface-400">Sauvegardez vos liens importants de mani\xE8re organis\xE9e et s\xE9curis\xE9e.</p></div><div class="card text-left">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:key-round",
        class: "w-8 h-8 text-accent-400 mb-3"
      }, null, _parent));
      _push(`<h3 class="font-semibold text-white mb-1">Mots de passe</h3><p class="text-sm text-surface-400">G\xE9rez tous vos mots de passe avec un chiffrement de niveau militaire.</p></div><div class="card text-left">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:bitcoin",
        class: "w-8 h-8 text-accent-400 mb-3"
      }, null, _parent));
      _push(`<h3 class="font-semibold text-white mb-1">Crypto</h3><p class="text-sm text-surface-400">Prot\xE9gez vos seed phrases et cl\xE9s priv\xE9es en toute confidentialit\xE9.</p></div></div></div></main><footer class="py-6 text-center text-sm text-surface-500 border-t border-surface-800"><p>\xA9 ${ssrInterpolate((/* @__PURE__ */ new Date()).getFullYear())} Kipit. Con\xE7u avec s\xE9curit\xE9 en RDC.</p></footer></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index-BilDUF2n.mjs.map
