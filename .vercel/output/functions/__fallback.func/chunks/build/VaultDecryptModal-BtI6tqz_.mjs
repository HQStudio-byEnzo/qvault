import __nuxt_component_1 from './index-4t8XY1h8.mjs';
import { defineComponent, ref, computed, mergeProps, unref, reactive, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderClass, ssrRenderComponent, ssrInterpolate, ssrRenderAttr, ssrRenderTeleport, ssrRenderList, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { u as useVault } from './useVault--imhJMK4.mjs';

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "VaultItemCard",
  __ssrInlineRender: true,
  props: {
    item: {}
  },
  emits: ["toggle-favorite", "delete", "decrypt"],
  setup(__props) {
    const props = __props;
    const copied = ref(false);
    const typeLabels = {
      link: "Lien",
      password: "Mot de passe",
      crypto: "Crypto"
    };
    const typeStyles = computed(() => {
      switch (props.item.type) {
        case "link":
          return { bg: "bg-blue-500/10", icon: "lucide:link", text: "text-blue-400" };
        case "password":
          return { bg: "bg-amber-500/10", icon: "lucide:key-round", text: "text-amber-400" };
        case "crypto":
          return { bg: "bg-orange-500/10", icon: "lucide:bitcoin", text: "text-orange-400" };
        default:
          return { bg: "bg-surface-700", icon: "lucide:file", text: "text-surface-400" };
      }
    });
    function formatDate(date) {
      return new Date(date).toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "card-hover flex items-center gap-4 p-4" }, _attrs))}><div class="${ssrRenderClass([unref(typeStyles).bg, "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"])}">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: unref(typeStyles).icon,
        class: ["w-5 h-5", unref(typeStyles).text]
      }, null, _parent));
      _push(`</div><div class="flex-1 min-w-0"><div class="flex items-center gap-2"><p class="text-sm font-medium text-surface-200 truncate">${ssrInterpolate(__props.item.label || "Sans titre")}</p>`);
      if (__props.item.is_encrypted) {
        _push(`<span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-accent-500/10 text-accent-400 border border-accent-500/20">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:lock",
          class: "w-2.5 h-2.5"
        }, null, _parent));
        _push(` Chiffr\xE9 </span>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><p class="text-xs text-surface-500 mt-0.5">${ssrInterpolate(typeLabels[__props.item.type])} \xB7 ${ssrInterpolate(formatDate(__props.item.created_at))}</p></div><div class="flex items-center gap-1">`);
      if (__props.item.is_encrypted) {
        _push(`<button class="p-2 rounded-lg hover:bg-surface-700 text-surface-400 hover:text-accent-400 transition-colors" title="D\xE9chiffrer">`);
        _push(ssrRenderComponent(_component_Icon, {
          name: "lucide:eye",
          class: "w-4 h-4"
        }, null, _parent));
        _push(`</button>`);
      } else {
        _push(`<button class="p-2 rounded-lg hover:bg-surface-700 text-surface-400 hover:text-green-400 transition-colors"${ssrRenderAttr("title", unref(copied) ? "Copi\xE9 !" : "Copier")}>`);
        _push(ssrRenderComponent(_component_Icon, {
          name: unref(copied) ? "lucide:check" : "lucide:copy",
          class: "w-4 h-4"
        }, null, _parent));
        _push(`</button>`);
      }
      _push(`<button class="${ssrRenderClass([__props.item.favorite ? "text-yellow-400" : "text-surface-400 hover:text-yellow-400", "p-2 rounded-lg hover:bg-surface-700 transition-colors"])}">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: __props.item.favorite ? "lucide:star" : "lucide:star",
        class: ["w-4 h-4", __props.item.favorite ? "fill-current" : ""]
      }, null, _parent));
      _push(`</button><button class="p-2 rounded-lg hover:bg-surface-700 text-surface-400 hover:text-red-400 transition-colors">`);
      _push(ssrRenderComponent(_component_Icon, {
        name: "lucide:trash-2",
        class: "w-4 h-4"
      }, null, _parent));
      _push(`</button></div></div>`);
    };
  }
});
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vault/VaultItemCard.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "VaultAddModal",
  __ssrInlineRender: true,
  props: {
    defaultType: {}
  },
  emits: ["close", "added"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const { error } = useVault();
    const isSubmitting = ref(false);
    const form = reactive({
      type: props.defaultType || "link",
      label: "",
      payload: "",
      shouldEncrypt: props.defaultType === "password" || props.defaultType === "crypto",
      masterPassword: ""
    });
    const types = [
      { value: "link", label: "Lien", icon: "lucide:link" },
      { value: "password", label: "Mot de passe", icon: "lucide:key-round" },
      { value: "crypto", label: "Crypto", icon: "lucide:bitcoin" }
    ];
    const payloadLabel = computed(() => {
      switch (form.type) {
        case "link":
          return "URL";
        case "password":
          return "Mot de passe";
        case "crypto":
          return "Seed phrase / Cl\xE9 priv\xE9e";
      }
    });
    const payloadPlaceholder = computed(() => {
      switch (form.type) {
        case "link":
          return "https://...";
        case "password":
          return "Votre mot de passe";
        case "crypto":
          return "word1 word2 word3...";
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_1;
      ssrRenderTeleport(_push, (_push2) => {
        _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4"><div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div><div class="relative w-full max-w-md bg-surface-900 border border-surface-700 rounded-2xl p-6 animate-scale-in"><div class="flex items-center justify-between mb-6"><h2 class="text-lg font-semibold text-white">Ajouter un \xE9l\xE9ment</h2><button class="p-2 rounded-lg hover:bg-surface-800 text-surface-400">`);
        _push2(ssrRenderComponent(_component_Icon, {
          name: "lucide:x",
          class: "w-5 h-5"
        }, null, _parent));
        _push2(`</button></div><form class="space-y-4"><div><label class="block text-sm font-medium text-surface-300 mb-2">Type</label><div class="grid grid-cols-3 gap-2"><!--[-->`);
        ssrRenderList(types, (t) => {
          _push2(`<button type="button" class="${ssrRenderClass([[
            unref(form).type === t.value ? "border-accent-500 bg-accent-500/10 text-accent-300" : "border-surface-700 bg-surface-800 text-surface-400 hover:border-surface-600"
          ], "p-3 rounded-lg border text-center transition-all text-sm"])}">`);
          _push2(ssrRenderComponent(_component_Icon, {
            name: t.icon,
            class: "w-5 h-5 mx-auto mb-1"
          }, null, _parent));
          _push2(` ${ssrInterpolate(t.label)}</button>`);
        });
        _push2(`<!--]--></div></div><div><label for="label" class="block text-sm font-medium text-surface-300 mb-1">Libell\xE9</label><input id="label"${ssrRenderAttr("value", unref(form).label)} type="text" class="input-field" placeholder="Ex: Gmail, Binance, Portfolio..."></div><div><label for="payload" class="block text-sm font-medium text-surface-300 mb-1">${ssrInterpolate(unref(payloadLabel))}</label><textarea id="payload" rows="3" required class="input-field resize-none font-mono text-sm"${ssrRenderAttr("placeholder", unref(payloadPlaceholder))}>${ssrInterpolate(unref(form).payload)}</textarea></div><div class="flex items-center justify-between p-3 rounded-lg bg-surface-800 border border-surface-700"><div class="flex items-center gap-2">`);
        _push2(ssrRenderComponent(_component_Icon, {
          name: "lucide:lock",
          class: "w-4 h-4 text-accent-400"
        }, null, _parent));
        _push2(`<span class="text-sm text-surface-300">Chiffrer cet \xE9l\xE9ment</span></div><button type="button" class="${ssrRenderClass([unref(form).shouldEncrypt ? "bg-accent-600" : "bg-surface-600", "relative w-10 h-6 rounded-full transition-colors"])}"><span class="${ssrRenderClass([unref(form).shouldEncrypt ? "left-5" : "left-1", "absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"])}"></span></button></div>`);
        if (unref(form).shouldEncrypt) {
          _push2(`<div><label for="masterPassword" class="block text-sm font-medium text-surface-300 mb-1"> Mot de passe ma\xEEtre </label><input id="masterPassword"${ssrRenderAttr("value", unref(form).masterPassword)} type="password" required class="input-field" placeholder="Votre mot de passe de chiffrement"><p class="text-xs text-surface-500 mt-1"> \u26A0\uFE0F Ce mot de passe n&#39;est jamais envoy\xE9 au serveur. Ne l&#39;oubliez pas ! </p></div>`);
        } else {
          _push2(`<!---->`);
        }
        if (unref(error)) {
          _push2(`<div class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">${ssrInterpolate(unref(error))}</div>`);
        } else {
          _push2(`<!---->`);
        }
        _push2(`<button type="submit"${ssrIncludeBooleanAttr(unref(isSubmitting)) ? " disabled" : ""} class="btn-primary w-full py-2.5">`);
        if (unref(isSubmitting)) {
          _push2(`<span>Ajout en cours...</span>`);
        } else {
          _push2(`<span>Ajouter au coffre-fort</span>`);
        }
        _push2(`</button></form></div></div>`);
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vault/VaultAddModal.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "VaultDecryptModal",
  __ssrInlineRender: true,
  props: {
    item: {}
  },
  emits: ["close"],
  setup(__props) {
    useVault();
    const masterPassword = ref("");
    const decryptedValue = ref("");
    const errorMsg = ref("");
    const isDecrypting = ref(false);
    const copied = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Icon = __nuxt_component_1;
      ssrRenderTeleport(_push, (_push2) => {
        _push2(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4"><div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div><div class="relative w-full max-w-md bg-surface-900 border border-surface-700 rounded-2xl p-6 animate-scale-in"><div class="flex items-center justify-between mb-6"><h2 class="text-lg font-semibold text-white flex items-center gap-2">`);
        _push2(ssrRenderComponent(_component_Icon, {
          name: "lucide:unlock",
          class: "w-5 h-5 text-accent-400"
        }, null, _parent));
        _push2(` D\xE9chiffrer </h2><button class="p-2 rounded-lg hover:bg-surface-800 text-surface-400">`);
        _push2(ssrRenderComponent(_component_Icon, {
          name: "lucide:x",
          class: "w-5 h-5"
        }, null, _parent));
        _push2(`</button></div>`);
        if (!unref(decryptedValue)) {
          _push2(`<div class="space-y-4"><p class="text-sm text-surface-400"> Entrez votre mot de passe ma\xEEtre pour d\xE9chiffrer \xAB <strong class="text-surface-200">${ssrInterpolate(__props.item.label || "Sans titre")}</strong> \xBB. </p><form class="space-y-4"><div><label for="masterPwd" class="block text-sm font-medium text-surface-300 mb-1"> Mot de passe ma\xEEtre </label><input id="masterPwd"${ssrRenderAttr("value", unref(masterPassword))} type="password" required autofocus class="input-field" placeholder="Votre mot de passe de chiffrement"></div>`);
          if (unref(errorMsg)) {
            _push2(`<div class="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-400">${ssrInterpolate(unref(errorMsg))}</div>`);
          } else {
            _push2(`<!---->`);
          }
          _push2(`<button type="submit"${ssrIncludeBooleanAttr(unref(isDecrypting)) ? " disabled" : ""} class="btn-primary w-full">`);
          if (unref(isDecrypting)) {
            _push2(`<span>D\xE9chiffrement...</span>`);
          } else {
            _push2(`<span>D\xE9chiffrer</span>`);
          }
          _push2(`</button></form></div>`);
        } else {
          _push2(`<div class="space-y-4"><div class="p-4 rounded-lg bg-surface-800 border border-surface-700"><p class="text-xs text-surface-500 mb-2">Contenu d\xE9chiffr\xE9 :</p><p class="text-sm text-surface-100 font-mono break-all whitespace-pre-wrap">${ssrInterpolate(unref(decryptedValue))}</p></div><div class="flex gap-2"><button class="btn-primary flex-1 flex items-center justify-center gap-2">`);
          _push2(ssrRenderComponent(_component_Icon, {
            name: unref(copied) ? "lucide:check" : "lucide:copy",
            class: "w-4 h-4"
          }, null, _parent));
          _push2(` ${ssrInterpolate(unref(copied) ? "Copi\xE9 !" : "Copier")}</button><button class="btn-secondary flex-1"> Fermer </button></div><p class="text-xs text-surface-500 text-center"> \u{1F512} Cette donn\xE9e n&#39;est visible que dans votre navigateur. </p></div>`);
        }
        _push2(`</div></div>`);
      }, "body", false, _parent);
    };
  }
});
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/vault/VaultDecryptModal.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as _, _sfc_main$1 as a, _sfc_main$2 as b };
//# sourceMappingURL=VaultDecryptModal-BtI6tqz_.mjs.map
