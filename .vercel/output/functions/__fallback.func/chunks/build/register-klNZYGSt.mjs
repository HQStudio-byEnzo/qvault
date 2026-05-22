import { _ as __nuxt_component_0 } from './nuxt-link-DmOlchq5.mjs';
import __nuxt_component_1 from './index-4t8XY1h8.mjs';
import { defineComponent, reactive, ref, mergeProps, withCtx, createVNode, unref, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { f as useAuthClient } from './server.mjs';
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
import '@iconify/vue';
import '@iconify/utils/lib/css/icon';
import './v3-D_1QdVRM.mjs';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'perfect-debounce';
import 'vue-router';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "register",
  __ssrInlineRender: true,
  setup(__props) {
    useAuthClient();
    const form = reactive({
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    });
    const isLoading = ref(false);
    const errorMsg = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen flex items-center justify-center px-4" }, _attrs))}><div class="w-full max-w-sm space-y-8 animate-fade-in"><div class="text-center">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/",
        class: "inline-flex items-center gap-2 mb-6"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-10 h-10 bg-accent-600 rounded-xl flex items-center justify-center"${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "lucide:shield",
              class: "w-6 h-6 text-white"
            }, null, _parent2, _scopeId));
            _push2(`</div>`);
          } else {
            return [
              createVNode("div", { class: "w-10 h-10 bg-accent-600 rounded-xl flex items-center justify-center" }, [
                createVNode(_component_Icon, {
                  name: "lucide:shield",
                  class: "w-6 h-6 text-white"
                })
              ])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<h1 class="text-2xl font-bold text-white">Cr\xE9er un compte</h1><p class="text-sm text-surface-400 mt-2">Commencez \xE0 s\xE9curiser vos donn\xE9es</p></div><form class="space-y-4"><div><label for="name" class="block text-sm font-medium text-surface-300 mb-1">Nom</label><input id="name"${ssrRenderAttr("value", unref(form).name)} type="text" required class="input-field" placeholder="Votre nom"></div><div><label for="email" class="block text-sm font-medium text-surface-300 mb-1">Email</label><input id="email"${ssrRenderAttr("value", unref(form).email)} type="email" required class="input-field" placeholder="vous@exemple.com"></div><div><label for="password" class="block text-sm font-medium text-surface-300 mb-1">Mot de passe</label><input id="password"${ssrRenderAttr("value", unref(form).password)} type="password" required minlength="8" class="input-field" placeholder="Minimum 8 caract\xE8res"></div><div><label for="confirmPassword" class="block text-sm font-medium text-surface-300 mb-1">Confirmer le mot de passe</label><input id="confirmPassword"${ssrRenderAttr("value", unref(form).confirmPassword)} type="password" required class="input-field" placeholder="\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"></div>`);
      if (unref(errorMsg)) {
        _push(`<div class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">${ssrInterpolate(unref(errorMsg))}</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button type="submit"${ssrIncludeBooleanAttr(unref(isLoading)) ? " disabled" : ""} class="btn-primary w-full py-2.5">`);
      if (unref(isLoading)) {
        _push(`<span>Cr\xE9ation...</span>`);
      } else {
        _push(`<span>Cr\xE9er mon compte</span>`);
      }
      _push(`</button></form><p class="text-center text-sm text-surface-400"> D\xE9j\xE0 un compte ? `);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/auth/login",
        class: "text-accent-400 hover:text-accent-300 font-medium"
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
      _push(`</p></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/auth/register.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=register-klNZYGSt.mjs.map
