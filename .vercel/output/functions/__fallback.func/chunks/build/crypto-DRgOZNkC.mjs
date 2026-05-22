import __nuxt_component_1 from './index-4t8XY1h8.mjs';
import { b as _sfc_main$2, a as _sfc_main$1, _ as _sfc_main$3 } from './VaultDecryptModal-BtI6tqz_.mjs';
import { defineComponent, ref, computed, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList } from 'vue/server-renderer';
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
  __name: "crypto",
  __ssrInlineRender: true,
  setup(__props) {
    const { items, loading, toggleFavorite, deleteItem } = useVault();
    const showAddModal = ref(false);
    const decryptTarget = ref(null);
    const filteredItems = computed(() => items.value.filter((i) => i.type === "crypto"));
    function handleDecrypt(item) {
      decryptTarget.value = item;
    }
    async function handleDelete(id) {
      if (confirm("Supprimer cet \xE9l\xE9ment crypto ?")) await deleteItem(id);
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_1;
      const _component_VaultItemCard = _sfc_main$2;
      const _component_VaultAddModal = _sfc_main$1;
      const _component_VaultDecryptModal = _sfc_main$3;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "p-6 lg:p-8 max-w-6xl mx-auto space-y-6" }, _attrs))}><div class="flex items-center justify-between"><div><h1 class="text-2xl font-bold text-white">Crypto</h1><p class="text-surface-400 text-sm mt-1">Vos seed phrases et cl\xE9s priv\xE9es</p></div><button class="btn-primary flex items-center gap-2">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:plus",
        class: "w-4 h-4"
      }, null, _parent));
      _push(` Ajouter </button></div><div class="p-3 rounded-lg bg-accent-500/10 border border-accent-500/20 text-sm text-accent-300 flex items-center gap-2">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:shield-check",
        class: "w-4 h-4 flex-shrink-0"
      }, null, _parent));
      _push(`<span>Nous recommandons fortement d&#39;activer le chiffrement pour vos cl\xE9s crypto.</span></div>`);
      if (unref(loading)) {
        _push(`<div class="flex items-center justify-center py-12">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:loader-2",
          class: "w-6 h-6 text-accent-400 animate-spin"
        }, null, _parent));
        _push(`</div>`);
      } else if (unref(filteredItems).length === 0) {
        _push(`<div class="text-center py-16">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:bitcoin",
          class: "w-12 h-12 text-surface-600 mx-auto mb-4"
        }, null, _parent));
        _push(`<p class="text-surface-400">Aucune cl\xE9 crypto sauvegard\xE9e.</p></div>`);
      } else {
        _push(`<div class="space-y-2"><!--[-->`);
        ssrRenderList(unref(filteredItems), (item) => {
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
          "default-type": "crypto",
          onClose: ($event) => showAddModal.value = false,
          onAdded: ($event) => showAddModal.value = false
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/dashboard/crypto.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=crypto-DRgOZNkC.mjs.map
