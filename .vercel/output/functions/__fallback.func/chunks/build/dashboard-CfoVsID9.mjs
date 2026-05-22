import { _ as __nuxt_component_0 } from './nuxt-link-DmOlchq5.mjs';
import __nuxt_component_1 from './index-4t8XY1h8.mjs';
import { useSSRContext, defineComponent, ref, mergeProps, withCtx, createVNode, toDisplayString, unref } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrInterpolate, ssrRenderTeleport, ssrRenderSlot } from 'vue/server-renderer';
import { f as useAuthClient } from './server.mjs';
import { _ as _export_sfc } from './_plugin-vue_export-helper-1tPrXgE0.mjs';
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
  __name: "dashboard",
  __ssrInlineRender: true,
  setup(__props) {
    const { user } = useAuthClient();
    const mobileMenuOpen = ref(false);
    const navItems = [
      { to: "/dashboard", label: "Tableau de bord", icon: "lucide:layout-dashboard" },
      { to: "/dashboard/vault", label: "Coffre-fort", icon: "lucide:vault" },
      { to: "/dashboard/links", label: "Liens", icon: "lucide:link" },
      { to: "/dashboard/passwords", label: "Mots de passe", icon: "lucide:key-round" },
      { to: "/dashboard/crypto", label: "Crypto", icon: "lucide:bitcoin" },
      { to: "/dashboard/settings", label: "Param\xE8tres", icon: "lucide:settings" }
    ];
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b, _c, _d;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_Icon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "min-h-screen bg-surface-950 flex" }, _attrs))} data-v-1e5d51e0><aside class="hidden lg:flex w-64 flex-col border-r border-surface-800 bg-surface-950" data-v-1e5d51e0><div class="h-16 flex items-center px-6 border-b border-surface-800" data-v-1e5d51e0>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/dashboard",
        class: "flex items-center gap-2"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center" data-v-1e5d51e0${_scopeId}>`);
            _push2(ssrRenderComponent(_component_Icon, {
              name: "lucide:shield",
              class: "w-5 h-5 text-white"
            }, null, _parent2, _scopeId));
            _push2(`</div><span class="text-lg font-semibold text-white" data-v-1e5d51e0${_scopeId}>Kipit</span>`);
          } else {
            return [
              createVNode("div", { class: "w-8 h-8 bg-accent-600 rounded-lg flex items-center justify-center" }, [
                createVNode(_component_Icon, {
                  name: "lucide:shield",
                  class: "w-5 h-5 text-white"
                })
              ]),
              createVNode("span", { class: "text-lg font-semibold text-white" }, "Kipit")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><nav class="flex-1 px-3 py-4 space-y-1" data-v-1e5d51e0><!--[-->`);
      ssrRenderList(navItems, (item) => {
        _push(ssrRenderComponent(_component_NuxtLink, {
          key: item.to,
          to: item.to,
          class: ["flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors", [
            _ctx.$route.path === item.to ? "bg-surface-800 text-white" : "text-surface-400 hover:text-surface-200 hover:bg-surface-900"
          ]]
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_Icon, {
                name: item.icon,
                class: "w-5 h-5"
              }, null, _parent2, _scopeId));
              _push2(`<span data-v-1e5d51e0${_scopeId}>${ssrInterpolate(item.label)}</span>`);
            } else {
              return [
                createVNode(_component_Icon, {
                  name: item.icon,
                  class: "w-5 h-5"
                }, null, 8, ["name"]),
                createVNode("span", null, toDisplayString(item.label), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
      });
      _push(`<!--]--></nav><div class="p-4 border-t border-surface-800" data-v-1e5d51e0><div class="flex items-center gap-3" data-v-1e5d51e0><div class="w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center" data-v-1e5d51e0><span class="text-sm font-medium text-surface-300" data-v-1e5d51e0>${ssrInterpolate(((_c = (_b = (_a = unref(user)) == null ? void 0 : _a.name) == null ? void 0 : _b.charAt(0)) == null ? void 0 : _c.toUpperCase()) || "?")}</span></div><div class="flex-1 min-w-0" data-v-1e5d51e0><p class="text-sm font-medium text-surface-200 truncate" data-v-1e5d51e0>${ssrInterpolate((_d = unref(user)) == null ? void 0 : _d.name)}</p></div><button class="p-1.5 rounded-lg hover:bg-surface-800 text-surface-400 hover:text-surface-200 transition-colors" data-v-1e5d51e0>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:log-out",
        class: "w-4 h-4"
      }, null, _parent));
      _push(`</button></div></div></aside><div class="flex-1 flex flex-col" data-v-1e5d51e0><header class="lg:hidden h-16 flex items-center justify-between px-4 border-b border-surface-800" data-v-1e5d51e0><div class="flex items-center gap-2" data-v-1e5d51e0><button class="p-2 rounded-lg hover:bg-surface-800 text-surface-400" data-v-1e5d51e0>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:menu",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</button><div class="w-7 h-7 bg-accent-600 rounded-lg flex items-center justify-center" data-v-1e5d51e0>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:shield",
        class: "w-4 h-4 text-white"
      }, null, _parent));
      _push(`</div><span class="font-semibold text-white" data-v-1e5d51e0>Kipit</span></div><button class="p-2 rounded-lg hover:bg-surface-800 text-surface-400" data-v-1e5d51e0>`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:log-out",
        class: "w-5 h-5"
      }, null, _parent));
      _push(`</button></header>`);
      ssrRenderTeleport(_push, (_push2) => {
        if (unref(mobileMenuOpen)) {
          _push2(`<div class="fixed inset-0 z-50 lg:hidden" data-v-1e5d51e0><div class="absolute inset-0 bg-black/60" data-v-1e5d51e0></div><div class="absolute left-0 top-0 bottom-0 w-64 bg-surface-950 border-r border-surface-800 p-4" data-v-1e5d51e0><nav class="space-y-1" data-v-1e5d51e0><!--[-->`);
          ssrRenderList(navItems, (item) => {
            _push2(ssrRenderComponent(_component_NuxtLink, {
              key: item.to,
              to: item.to,
              class: "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-surface-400 hover:text-surface-200 hover:bg-surface-900 transition-colors",
              onClick: ($event) => mobileMenuOpen.value = false
            }, {
              default: withCtx((_, _push3, _parent2, _scopeId) => {
                if (_push3) {
                  _push3(ssrRenderComponent(_component_Icon, {
                    name: item.icon,
                    class: "w-5 h-5"
                  }, null, _parent2, _scopeId));
                  _push3(`<span data-v-1e5d51e0${_scopeId}>${ssrInterpolate(item.label)}</span>`);
                } else {
                  return [
                    createVNode(_component_Icon, {
                      name: item.icon,
                      class: "w-5 h-5"
                    }, null, 8, ["name"]),
                    createVNode("span", null, toDisplayString(item.label), 1)
                  ];
                }
              }),
              _: 2
            }, _parent));
          });
          _push2(`<!--]--></nav></div></div>`);
        } else {
          _push2(`<!---->`);
        }
      }, "body", false, _parent);
      _push(`<main class="flex-1 overflow-y-auto" data-v-1e5d51e0>`);
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main></div></div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/dashboard.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const dashboard = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-1e5d51e0"]]);

export { dashboard as default };
//# sourceMappingURL=dashboard-CfoVsID9.mjs.map
