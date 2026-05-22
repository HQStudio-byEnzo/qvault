import __nuxt_component_1 from './index-4t8XY1h8.mjs';
import { b as _sfc_main$2, a as _sfc_main$1, _ as _sfc_main$3 } from './VaultDecryptModal-BtI6tqz_.mjs';
import { defineComponent, ref, watch, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderList, ssrRenderClass, ssrInterpolate } from 'vue/server-renderer';
import { u as useVault } from './useVault--imhJMK4.mjs';
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
  __name: "vault",
  __ssrInlineRender: true,
  setup(__props) {
    const { items, loading, fetchItems, toggleFavorite, deleteItem } = useVault();
    const showAddModal = ref(false);
    const decryptTarget = ref(null);
    const searchQuery = ref("");
    const activeFilter = ref("");
    const filters = [
      { label: "Tout", value: "" },
      { label: "Liens", value: "link" },
      { label: "Mots de passe", value: "password" },
      { label: "Crypto", value: "crypto" }
    ];
    watch(activeFilter, () => {
      fetchItems({ type: activeFilter.value || void 0, search: searchQuery.value || void 0 });
    });
    function onItemAdded() {
      showAddModal.value = false;
    }
    function handleDecrypt(item) {
      decryptTarget.value = item;
    }
    async function handleDelete(id) {
      if (confirm("\xCAtes-vous s\xFBr de vouloir supprimer cet \xE9l\xE9ment ?")) {
        await deleteItem(id);
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_1;
      const _component_VaultItemCard = _sfc_main$2;
      const _component_VaultAddModal = _sfc_main$1;
      const _component_VaultDecryptModal = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-6 lg:p-8 max-w-6xl mx-auto space-y-6" }, _attrs))}><div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"><div><h1 class="text-2xl font-bold text-white">Coffre-fort</h1><p class="text-surface-400 text-sm mt-1">Tous vos \xE9l\xE9ments s\xE9curis\xE9s</p></div><button class="btn-primary flex items-center gap-2">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:plus",
        class: "w-4 h-4"
      }, null, _parent));
      _push(` Ajouter </button></div><div class="flex flex-col sm:flex-row gap-3"><div class="relative flex-1">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:search",
        class: "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-500"
      }, null, _parent));
      _push(`<input${ssrRenderAttr("value", unref(searchQuery))} type="text" placeholder="Rechercher..." class="input-field pl-10"></div><div class="flex gap-2"><!--[-->`);
      ssrRenderList(filters, (filter) => {
        _push(`<button class="${ssrRenderClass([[
          unref(activeFilter) === filter.value ? "bg-accent-600 text-white" : "bg-surface-800 text-surface-400 hover:text-surface-200"
        ], "px-3 py-2 rounded-lg text-sm font-medium transition-colors"])}">${ssrInterpolate(filter.label)}</button>`);
      });
      _push(`<!--]--></div></div>`);
      if (unref(loading)) {
        _push(`<div class="flex items-center justify-center py-12">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:loader-2",
          class: "w-6 h-6 text-accent-400 animate-spin"
        }, null, _parent));
        _push(`</div>`);
      } else if (unref(items).length === 0) {
        _push(`<div class="text-center py-16">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:vault",
          class: "w-12 h-12 text-surface-600 mx-auto mb-4"
        }, null, _parent));
        _push(`<p class="text-surface-400">Votre coffre-fort est vide.</p><p class="text-sm text-surface-500 mt-1">Commencez par ajouter un \xE9l\xE9ment.</p></div>`);
      } else {
        _push(`<div class="space-y-2"><!--[-->`);
        ssrRenderList(unref(items), (item) => {
          _push(ssrRenderComponent(_component_VaultItemCard, {
            key: item.id,
            item,
            onToggleFavorite: ($event) => unref(toggleFavorite)(item),
            onDelete: ($event) => handleDelete(item.id),
            onDecrypt: ($event) => handleDecrypt(item)
          }, null, _parent));
        });
        _push(`<!--]--></div>`);
      }
      if (unref(showAddModal)) {
        _push(ssrRenderComponent(_component_VaultAddModal, {
          onClose: ($event) => showAddModal.value = false,
          onAdded: onItemAdded
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (unref(decryptTarget)) {
        _push(ssrRenderComponent(_component_VaultDecryptModal, {
          item: unref(decryptTarget),
          onClose: ($event) => decryptTarget.value = null
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/vault.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=vault-CfrCCnTn.mjs.map
