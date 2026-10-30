<template>
  <div class="lang-switch" role="group" :aria-label="t('nav.language')">
    <button
      v-for="code in LOCALES"
      :key="code"
      type="button"
      class="lang-switch__option"
      :class="{ 'is-active': locale === code }"
      :aria-pressed="locale === code ? 'true' : 'false'"
      :lang="code"
      @click="setLocale(code)"
    >
      {{ code.toUpperCase() }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { useLang } from '~/composables/useI18n'

const { locale, setLocale, t } = useLang()

const LOCALES = ['fr', 'en'] as const
</script>

<style scoped>
/* Deux langues visibles, cible de 44 px : l'ancien bouton « FR » + icône ne
   disait pas qu'il s'agissait d'une bascule. */
.lang-switch {
  align-items: center;
  border: 1px solid var(--lp-rule, var(--color-rule));
  border-radius: 999px;
  display: inline-flex;
  overflow: hidden;
}

.lang-switch__option {
  align-items: center;
  background: transparent;
  border: 0;
  color: var(--color-text-muted);
  display: inline-flex;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  height: 2.75rem;
  justify-content: center;
  min-width: 2.5rem;
  padding-inline: 0.5rem;
}

.lang-switch__option.is-active {
  background: var(--color-accent-soft);
  color: var(--color-accent-text);
}

.lang-switch__option:focus-visible {
  outline: 2px solid var(--color-accent-500);
  outline-offset: -2px;
}
</style>
