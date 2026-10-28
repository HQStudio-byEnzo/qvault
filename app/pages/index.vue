<template>
  <main class="lp">
    <header class="lp-nav">
      <div class="lp-nav__inner">
        <NuxtLink to="/" class="lp-brand" aria-label="QVault">
          <UiQVaultLogo :size="28" />
          <span>QVault</span>
        </NuxtLink>

        <nav class="lp-nav__links" aria-label="Navigation">
          <a href="#features">{{ t('nav.features') }}</a>
          <a href="#how">{{ t('nav.how') }}</a>
          <a href="#tools">{{ t('nav.tools') }}</a>
          <NuxtLink to="/support">{{ t('sidebar.support') }}</NuxtLink>
        </nav>

        <div class="lp-nav__actions">
          <UiLangSwitch />
          <NuxtLink v-if="!loggedIn" to="/auth/login" class="btn-secondary lp-nav__login">{{ t('nav.login') }}</NuxtLink>
          <NuxtLink :to="loggedIn ? '/dashboard' : '/auth/register'" class="btn-primary lp-nav__cta">
            {{ loggedIn ? t('hero.dashboardCta') : t('hero.cta') }}
          </NuxtLink>

          <button
            ref="menuButton"
            type="button"
            class="lp-nav__toggle"
            data-lp-menu-button
            aria-controls="lp-nav-panel"
            :aria-expanded="menuOpen ? 'true' : 'false'"
            :aria-label="menuOpen ? t('nav.closeMenu') : t('nav.openMenu')"
            @click="toggleMenu"
          >
            <Icon :name="menuOpen ? 'hugeicons:cancel-01' : 'hugeicons:menu-01'" class="h-5 w-5" />
          </button>
        </div>
      </div>

      <nav v-show="menuOpen" id="lp-nav-panel" ref="menuPanel" class="lp-nav__panel" :aria-label="t('nav.menu')">
        <a href="#features" @click="closeMenu">{{ t('nav.features') }}</a>
        <a href="#how" @click="closeMenu">{{ t('nav.how') }}</a>
        <a href="#tools" @click="closeMenu">{{ t('nav.tools') }}</a>
        <NuxtLink to="/support" @click="closeMenu">{{ t('sidebar.support') }}</NuxtLink>
        <NuxtLink v-if="!loggedIn" to="/auth/login" class="lp-nav__panel-login" @click="closeMenu">{{ t('nav.login') }}</NuxtLink>
        <NuxtLink :to="loggedIn ? '/dashboard' : '/auth/register'" class="btn-primary lp-nav__panel-cta" @click="closeMenu">
          {{ loggedIn ? t('hero.dashboardCta') : t('hero.cta') }}
        </NuxtLink>
      </nav>
    </header>

    <section class="lp-hero">
      <div class="lp-hero__copy">
        <span class="eyebrow">{{ t('hero.badge') }}</span>
        <h1 class="lp-hero__title">
          {{ t('hero.title1') }}
          <span>{{ t('hero.title2') }}</span>
        </h1>
        <p class="lp-hero__lede">{{ t('hero.subtitle') }}</p>
        <div class="lp-hero__actions">
          <NuxtLink :to="loggedIn ? '/dashboard' : '/auth/register'" class="btn-primary">
            {{ loggedIn ? t('dash.openVault') : t('hero.cta') }}
            <Icon name="hugeicons:arrow-right-01" class="h-4 w-4" />
          </NuxtLink>
          <NuxtLink v-if="!loggedIn" to="/auth/login" class="btn-secondary">
            {{ t('hero.login') }}
          </NuxtLink>
        </div>
        <ul class="lp-hero__points">
          <li><Icon name="hugeicons:check" class="h-4 w-4" /> {{ t('hero.free') }}</li>
          <li><Icon name="hugeicons:check" class="h-4 w-4" /> {{ t('hero.openSource') }}</li>
          <li><Icon name="hugeicons:check" class="h-4 w-4" /> {{ t('hero.privateByDefault') }}</li>
        </ul>
      </div>

      <div class="lp-preview" aria-hidden="true">
        <div class="lp-preview__head">
          <span class="lp-preview__dots"><i /><i /><i /></span>
          <span class="lp-preview__title">QVault</span>
          <span class="tech-status">Verrouillé</span>
        </div>
        <ul class="lp-preview__list">
          <li v-for="row in previewRows" :key="row.label">
            <span class="lp-preview__icon"><Icon :name="row.icon" class="h-4 w-4" /></span>
            <span class="lp-preview__label">{{ row.label }}</span>
            <span class="lp-preview__value">{{ row.value }}</span>
          </li>
        </ul>
        <div class="lp-preview__foot">
          <Icon name="hugeicons:lock-keyhole" class="h-4 w-4" />
          <span>Chiffré dans votre navigateur</span>
        </div>
      </div>
    </section>

    <section id="features" class="lp-section scroll-mt-24">
      <header class="lp-section__head">
        <p class="eyebrow">{{ t('landing.capabilitiesLabel') }}</p>
        <h2>{{ t('landing.capabilitiesTitle') }}</h2>
        <p class="lp-section__lede">{{ t('landing.capabilitiesDesc') }}</p>
      </header>
      <div class="lp-features">
        <NuxtLink v-for="feature in features" :key="feature.slug" :to="`/features/${feature.slug}`" class="lp-feature">
          <span class="lp-feature__icon"><Icon :name="feature.icon" class="h-5 w-5" /></span>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.summary }}</p>
          <span class="lp-feature__link">{{ t('landing.readMore') }} <Icon name="hugeicons:arrow-right-01" class="h-4 w-4" /></span>
        </NuxtLink>
      </div>
    </section>

    <section id="how" class="lp-section scroll-mt-24">
      <header class="lp-section__head">
        <p class="eyebrow">{{ t('landing.workflowLabel') }}</p>
        <h2>{{ t('landing.workflowTitle') }}</h2>
        <p class="lp-section__lede">{{ t('landing.workflowDesc') }}</p>
      </header>
      <ol class="lp-steps">
        <li v-for="(step, index) in workflow" :key="step.title">
          <span class="lp-steps__index">{{ index + 1 }}</span>
          <div>
            <h3>{{ step.title }}</h3>
            <p>{{ step.description }}</p>
          </div>
        </li>
      </ol>
    </section>

    <section id="tools" class="lp-section scroll-mt-24">
      <header class="lp-section__head">
        <p class="eyebrow">{{ t('landing.toolsLabel') }}</p>
        <h2>{{ t('landing.toolsTitle') }}</h2>
        <p class="lp-section__lede">{{ t('landing.toolsDesc') }}</p>
      </header>
      <div class="lp-tools">
        <NuxtLink v-for="tool in tools" :key="tool.to" :to="tool.to" class="lp-tool">
          <span class="lp-tool__icon"><Icon :name="tool.icon" class="h-5 w-5" /></span>
          <div>
            <h3>{{ tool.title }}</h3>
            <p>{{ tool.description }}</p>
          </div>
          <Icon name="hugeicons:arrow-up-right-01" class="h-4 w-4" />
        </NuxtLink>
      </div>
    </section>

    <section id="security" class="lp-section scroll-mt-24">
      <div class="lp-security">
        <div class="lp-security__copy">
          <p class="eyebrow">{{ t('landing.securityLabel') }}</p>
          <h2>{{ t('landing.securityTitle') }}</h2>
          <p class="lp-section__lede">{{ t('landing.securityDesc') }}</p>
          <NuxtLink to="/audit-securite" class="btn-secondary">
            {{ t('landing.inspectSecurity') }}
            <Icon name="hugeicons:arrow-right-01" class="h-4 w-4" />
          </NuxtLink>
        </div>
        <ol class="lp-security__flow">
          <li v-for="node in securityFlow" :key="node.title">
            <span>{{ node.index }}</span>
            <div>
              <strong>{{ node.title }}</strong>
              <small>{{ node.description }}</small>
            </div>
          </li>
        </ol>
      </div>
    </section>

    <section class="lp-section">
      <header class="lp-section__head">
        <p class="eyebrow">FAQ</p>
        <h2>{{ t('faq.title') }}</h2>
      </header>
      <div class="lp-faq">
        <details v-for="(item, index) in faqItems" :key="index">
          <summary>{{ item.question }} <Icon name="hugeicons:plus" class="h-4 w-4" /></summary>
          <p>{{ item.answer }}</p>
        </details>
      </div>
    </section>

    <section class="lp-cta">
      <h2>{{ t('landing.finalTitle') }}</h2>
      <NuxtLink :to="loggedIn ? '/dashboard' : '/auth/register'" class="btn-primary">
        {{ loggedIn ? t('dash.openVault') : t('hero.cta') }}
        <Icon name="hugeicons:arrow-right-01" class="h-4 w-4" />
      </NuxtLink>
    </section>

    <footer class="lp-footer">
      <div class="lp-footer__brand">
        <UiQVaultLogo :size="24" />
        <span>QVault</span>
      </div>
      <nav class="lp-footer__links" :aria-label="t('landing.footerLabel')">
        <NuxtLink to="/support">{{ t('sidebar.support') }}</NuxtLink>
        <NuxtLink to="/features">{{ t('nav.features') }}</NuxtLink>
        <NuxtLink to="/guides">{{ t('nav.guides') }}</NuxtLink>
        <NuxtLink to="/legal/cgu">{{ t('footer.terms') }}</NuxtLink>
        <NuxtLink to="/legal/confidentialite">{{ t('footer.privacy') }}</NuxtLink>
        <a
          :href="SOURCE_CODE_URL"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-1.5"
        >
          {{ t('footer.sourceCode') }}
          <Icon name="hugeicons:arrow-up-right-01" class="h-3.5 w-3.5" />
        </a>
      </nav>
      <p class="lp-footer__note">{{ t('landing.footerNote') }}</p>
    </footer>
  </main>
</template>

<script setup lang="ts">
import { useLang } from '~/composables/useI18n'

definePageMeta({ layout: 'default' })

const { t, locale } = useLang()
const { loggedIn } = useUserSession()
const { features } = useFeatureCatalog()

const SOURCE_CODE_URL = 'https://github.com/HQStudio-byEnzo/qvault'

// Menu de navigation mobile : le header ne garde que le logo, la langue et le
// CTA sous 60rem, d'où ce panneau. Il se ferme au clic d'un lien, sur Échap et
// dès que la largeur repasse au-dessus du point de rupture.
const menuOpen = ref(false)
const menuButton = ref<HTMLButtonElement | null>(null)
const menuPanel = ref<HTMLElement | null>(null)

function closeMenu() {
  menuOpen.value = false
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value
  if (menuOpen.value) nextTick(() => menuPanel.value?.querySelector('a')?.focus())
}

function onMenuKeydown(event: KeyboardEvent) {
  if (event.key !== 'Escape' || !menuOpen.value) return
  menuOpen.value = false
  menuButton.value?.focus()
}

function onViewportChange(event: MediaQueryListEvent) {
  if (event.matches) menuOpen.value = false
}

let viewportQuery: MediaQueryList | null = null

onMounted(() => {
  window.addEventListener('keydown', onMenuKeydown)
  viewportQuery = window.matchMedia('(min-width: 60rem)')
  viewportQuery.addEventListener('change', onViewportChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onMenuKeydown)
  viewportQuery?.removeEventListener('change', onViewportChange)
})

// Single source of truth: the visible FAQ and its structured data stay in sync.
const faqItems = computed(() => Array.from({ length: 6 }, (_, index) => ({
  question: t(`faq.q${index + 1}`),
  answer: t(`faq.a${index + 1}`),
})))

useHead(() => ({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      inLanguage: locale.value,
      mainEntity: faqItems.value.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    }),
  }],
}))

const previewRows = [
  { icon: 'hugeicons:key-round', label: 'Gmail', value: '••••••••' },
  { icon: 'hugeicons:bitcoin', label: 'Portefeuille', value: 'Phrase de récupération' },
  { icon: 'hugeicons:shield-check', label: 'Code 2FA', value: '482 193' },
  { icon: 'hugeicons:notebook-pen', label: 'Note privée', value: 'Chiffrée' },
]

const workflow = computed(() => [
  { icon: 'hugeicons:plus', title: t('landing.stepCaptureTitle'), description: t('landing.stepCaptureDesc') },
  { icon: 'hugeicons:lock-keyhole', title: t('landing.stepEncryptTitle'), description: t('landing.stepEncryptDesc') },
  { icon: 'hugeicons:search-01', title: t('landing.stepFindTitle'), description: t('landing.stepFindDesc') },
])

const tools = computed(() => [
  { to: '/generateur-mot-de-passe', icon: 'hugeicons:sparkles', title: t('tools.password.title'), description: t('tools.password.desc') },
  { to: '/generateur-seed-phrase', icon: 'hugeicons:list-ordered', title: t('tools.seed.title'), description: t('tools.seed.desc') },
  { to: '/audit-securite', icon: 'hugeicons:shield-check', title: t('tools.audit.title'), description: t('tools.audit.desc') },
])

const securityFlow = computed(() => [
  { index: '1', title: t('landing.flowPlainTitle'), description: t('landing.flowPlainDesc') },
  { index: '2', title: t('landing.flowCipherTitle'), description: t('landing.flowCipherDesc') },
  { index: '3', title: t('landing.flowStoreTitle'), description: t('landing.flowStoreDesc') },
])
</script>

<style scoped>
.lp {
  background: var(--color-paper);
  color: var(--color-text);
  /* 3,28:1 sur le fond de page : les bordures de carte restent visibles en
     plein jour, contrairement au token --color-rule (1,44:1). */
  --lp-rule: oklch(0.5 0.018 107.3);
}

.lp-nav {
  background: color-mix(in oklab, var(--color-paper) 88%, transparent);
  border-bottom: 1px solid var(--color-rule);
  position: sticky;
  top: 0;
  z-index: 40;
  backdrop-filter: blur(12px);
}

.lp-nav__inner {
  align-items: center;
  display: flex;
  gap: var(--space-4);
  margin-inline: auto;
  max-width: 76rem;
  min-height: 4rem;
  padding-inline: clamp(var(--space-4), 4vw, var(--space-8));
}

.lp-brand {
  align-items: center;
  color: var(--color-ink);
  display: inline-flex;
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 600;
  gap: var(--space-tight);
  text-decoration: none;
}

.lp-nav__links {
  display: none;
  gap: var(--space-6);
  margin-inline: auto;
}

.lp-nav__links a {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: color var(--dur-base) var(--ease-out);
}

.lp-nav__links a:hover {
  color: var(--color-ink);
}

.lp-nav__actions {
  align-items: center;
  display: flex;
  gap: var(--space-2);
  margin-inline-start: auto;
}

/* Le burger n'apparaît qu'avec le panneau : au-delà de 60rem les liens sont
   visibles dans la barre. */
.lp-nav__toggle {
  align-items: center;
  background: transparent;
  border: 1px solid var(--lp-rule);
  border-radius: var(--radius-md);
  color: var(--color-ink);
  display: inline-flex;
  height: 2.75rem;
  justify-content: center;
  width: 2.75rem;
}

.lp-nav__toggle:focus-visible {
  outline: 2px solid var(--color-accent-500);
  outline-offset: 2px;
}

.lp-nav__panel {
  background: var(--color-paper);
  border-bottom: 1px solid var(--lp-rule);
  display: flex;
  flex-direction: column;
  padding: var(--space-2) clamp(var(--space-4), 4vw, var(--space-8)) var(--space-4);
}

.lp-nav__panel a {
  align-items: center;
  border-bottom: 1px solid var(--color-rule);
  color: var(--color-text);
  display: flex;
  font-size: 1rem;
  min-height: 2.75rem;
  text-decoration: none;
}

.lp-nav__panel a:last-child {
  border-bottom: 0;
}

.lp-nav__panel-login {
  color: var(--color-accent-text) !important;
  font-weight: 600;
}

.lp-hero {
  align-items: center;
  display: grid;
  gap: clamp(var(--space-8), 6vw, var(--space-16));
  margin-inline: auto;
  max-width: 76rem;
  padding: clamp(var(--space-12), 8vw, var(--space-24)) clamp(var(--space-4), 4vw, var(--space-8));
}

.lp-hero__title {
  color: var(--color-ink);
  /* 60 px en colonne de 520 px donnait quatre lignes ; 48 px max en donne
     deux à trois, y compris avec la version anglaise plus longue. */
  font-size: clamp(2rem, 4.4vw, 3rem);
  line-height: 1.1;
  margin-top: var(--space-4);
  text-wrap: balance;
}

.lp-hero__title span {
  color: var(--color-accent-600);
  display: block;
}

.lp-hero__lede {
  color: var(--color-text-muted);
  font-size: 1.125rem;
  line-height: 1.6;
  margin-top: var(--space-5);
  max-width: 34rem;
  text-wrap: pretty;
}

.lp-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  margin-top: var(--space-6);
}

/* 44 px au doigt, 40 px à la souris. */
.lp :is(.btn-primary, .btn-secondary) {
  min-height: 2.75rem;
}

@media (min-width: 60rem) {
  .lp :is(.btn-primary, .btn-secondary) {
    min-height: 2.5rem;
  }
}

.lp-hero__points {
  color: var(--color-text-muted);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-5);
  margin-top: var(--space-6);
  font-size: 0.875rem;
}

.lp-hero__points li {
  align-items: center;
  display: inline-flex;
  gap: var(--space-2);
}

.lp-hero__points svg {
  color: var(--color-accent-600);
}

.lp-preview {
  background: var(--color-paper);
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-xl);
  box-shadow: 0 24px 60px oklch(0.2 0.01 107 / 0.12);
  overflow: hidden;
}

.lp-preview__head {
  align-items: center;
  background: var(--color-paper-2);
  border-bottom: 1px solid var(--color-rule);
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
}

.lp-preview__dots {
  display: inline-flex;
  gap: 5px;
}

.lp-preview__dots i {
  background: var(--color-rule-strong);
  border-radius: 999px;
  height: 0.5rem;
  width: 0.5rem;
}

.lp-preview__title {
  color: var(--color-ink);
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 600;
}

.lp-preview__head .tech-status {
  margin-inline-start: auto;
}

.lp-preview__list {
  display: grid;
  gap: 2px;
  padding: var(--space-3);
}

.lp-preview__list li {
  align-items: center;
  display: flex;
  gap: var(--space-3);
  padding: var(--space-3);
}

.lp-preview__icon {
  align-items: center;
  background: var(--color-accent-soft);
  border-radius: var(--radius-md);
  color: var(--color-accent-strong);
  display: grid;
  height: 2rem;
  place-items: center;
  width: 2rem;
}

.lp-preview__label {
  color: var(--color-ink);
  flex: 1;
  font-size: 0.9375rem;
  font-weight: 500;
}

.lp-preview__value {
  color: var(--color-text-muted);
  font-family: var(--font-mono);
  font-size: 0.875rem;
}

/* Seul endroit de la page où la couleur dit « protégé ». */
.lp-preview__head .tech-status {
  border-color: color-mix(in oklab, var(--color-accent-500) 45%, var(--lp-rule));
  color: var(--color-accent-500);
}

.lp-preview__foot {
  align-items: center;
  background: var(--color-paper-2);
  border-top: 1px solid var(--color-rule);
  color: var(--color-text-muted);
  display: flex;
  font-size: 0.75rem;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
}

.lp-section {
  margin-inline: auto;
  max-width: 76rem;
  padding: clamp(var(--space-10), 4.5vw, var(--space-16)) clamp(var(--space-4), 4vw, var(--space-8));
}

/* Une seule bande de surface différente : elle casse le noir continu et
   marque la section Confidentialité sans pastille supplémentaire. */
.lp-security {
  background: var(--color-paper-2);
  border: 1px solid var(--lp-rule);
  border-radius: var(--radius-xl);
  padding: clamp(var(--space-6), 4vw, var(--space-10));
}

.lp-section__head {
  max-width: 44rem;
}

.lp-section__head h2 {
  color: var(--color-ink);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  margin-top: var(--space-3);
  text-wrap: balance;
}

.lp-section__lede {
  color: var(--color-text-muted);
  font-size: 1.0625rem;
  line-height: 1.6;
  margin-top: var(--space-4);
  text-wrap: pretty;
}

.lp-features {
  display: grid;
  gap: var(--space-4);
  margin-top: var(--space-10);
  grid-template-columns: minmax(0, 1fr);
}

.lp-feature {
  background: var(--color-paper-2);
  border: 1px solid var(--lp-rule);
  border-radius: var(--radius-lg);
  color: inherit;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-5);
  text-decoration: none;
  transition: border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out), transform var(--dur-base) var(--ease-out);
}

.lp-feature:hover {
  border-color: color-mix(in oklab, var(--color-accent-500) 40%, var(--color-rule));
  box-shadow: 0 12px 32px oklch(0.2 0.01 107 / 0.08);
  transform: translateY(-2px);
}

.lp-feature__icon {
  align-items: center;
  background: var(--color-accent-soft);
  border-radius: var(--radius-md);
  color: var(--color-accent-strong);
  display: grid;
  height: 2.5rem;
  place-items: center;
  width: 2.5rem;
}

.lp-feature h3 {
  color: var(--color-ink);
  font-family: var(--font-display);
  font-size: 1.0625rem;
  line-height: 1.3;
}

.lp-feature p {
  color: var(--color-text-muted);
  flex: 1;
  font-size: 0.875rem;
  line-height: 1.6;
}

.lp-feature__link {
  align-items: center;
  color: var(--color-accent-600);
  display: inline-flex;
  font-size: 0.8125rem;
  font-weight: 600;
  gap: var(--space-1);
}

.lp-steps {
  counter-reset: step;
  display: grid;
  gap: var(--space-4);
  margin-top: var(--space-10);
  grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr));
}

.lp-steps li {
  border-top: 2px solid var(--color-accent-600);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding-top: var(--space-4);
}

.lp-steps__index {
  align-items: center;
  background: var(--color-accent-soft);
  border-radius: 999px;
  color: var(--color-accent-text);
  display: grid;
  font-family: var(--font-display);
  font-size: 0.8125rem;
  font-weight: 600;
  height: 1.75rem;
  place-items: center;
  width: 1.75rem;
}

.lp-steps h3 {
  align-items: center;
  color: var(--color-ink);
  display: flex;
  font-family: var(--font-display);
  font-size: 1.125rem;
  gap: var(--space-2);
}

.lp-steps p {
  color: var(--color-text-muted);
  font-size: 0.875rem;
  line-height: 1.6;
  margin-top: var(--space-2);
}

.lp-tools {
  display: grid;
  gap: var(--space-4);
  margin-top: var(--space-10);
  grid-template-columns: repeat(auto-fit, minmax(17rem, 1fr));
}

.lp-tool {
  align-items: flex-start;
  background: var(--color-paper-2);
  border: 1px solid var(--lp-rule);
  border-radius: var(--radius-lg);
  color: inherit;
  display: flex;
  gap: var(--space-4);
  padding: var(--space-5);
  text-decoration: none;
  transition: border-color var(--dur-base) var(--ease-out), background-color var(--dur-base) var(--ease-out);
}

.lp-tool:hover {
  background: var(--color-paper);
  border-color: color-mix(in oklab, var(--color-accent-500) 40%, var(--color-rule));
}

.lp-tool__icon {
  align-items: center;
  background: var(--color-paper);
  border: 1px solid var(--color-rule);
  border-radius: var(--radius-md);
  color: var(--color-accent-strong);
  display: grid;
  height: 2.5rem;
  place-items: center;
  width: 2.5rem;
}

.lp-tool h3 {
  color: var(--color-ink);
  font-family: var(--font-display);
  font-size: 1rem;
  line-height: 1.3;
}

.lp-tool p {
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  margin-top: var(--space-1);
}

.lp-tool > svg {
  color: var(--color-text-faint);
  margin-inline-start: auto;
  margin-top: 0.25rem;
}

.lp-security {
  display: grid;
  gap: clamp(var(--space-8), 6vw, var(--space-16));
}

.lp-security__copy h2 {
  color: var(--color-ink);
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  margin-block: var(--space-3) var(--space-4);
  text-wrap: balance;
}

.lp-security__flow {
  display: grid;
  gap: var(--space-3);
}

.lp-security__flow li {
  align-items: flex-start;
  background: var(--color-paper-2);
  border: 1px solid var(--lp-rule);
  border-radius: var(--radius-lg);
  display: flex;
  gap: var(--space-4);
  padding: var(--space-4);
}

.lp-security__flow span {
  align-items: center;
  background: var(--color-accent-soft);
  border-radius: 999px;
  color: var(--color-accent-strong);
  display: grid;
  font-family: var(--font-display);
  font-weight: 600;
  height: 1.75rem;
  place-items: center;
  width: 1.75rem;
}

.lp-security__flow strong {
  color: var(--color-ink);
  display: block;
  font-size: 0.9375rem;
}

.lp-security__flow small {
  color: var(--color-text-muted);
  font-size: 0.8125rem;
  line-height: 1.5;
}

.lp-faq {
  border-top: 1px solid var(--color-rule);
  margin-top: var(--space-8);
}

.lp-faq details {
  border-bottom: 1px solid var(--color-rule);
}

.lp-faq summary {
  align-items: center;
  color: var(--color-ink);
  cursor: pointer;
  display: flex;
  font-family: var(--font-display);
  font-size: 1rem;
  justify-content: space-between;
  list-style: none;
  min-height: 3.5rem;
  padding-block: var(--space-3);
}

.lp-faq summary::-webkit-details-marker {
  display: none;
}

.lp-faq p {
  color: var(--color-text-muted);
  font-size: 0.9375rem;
  line-height: 1.6;
  padding-bottom: var(--space-4);
  max-width: 48rem;
}

.lp-cta {
  align-items: center;
  background: var(--color-paper-2);
  border: 1px solid var(--lp-rule);
  border-radius: var(--radius-xl);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-6);
  justify-content: space-between;
  margin-inline: auto;
  max-width: 76rem;
  padding: clamp(var(--space-8), 5vw, var(--space-12)) clamp(var(--space-5), 4vw, var(--space-10));
}

.lp-cta h2 {
  color: var(--color-ink);
  font-size: clamp(1.75rem, 3.4vw, 2.5rem);
  max-width: 34rem;
  text-wrap: balance;
}

.lp-footer {
  align-items: center;
  border-top: 1px solid var(--color-rule);
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
  justify-content: space-between;
  margin-inline: auto;
  max-width: 76rem;
  padding: var(--space-8) clamp(var(--space-4), 4vw, var(--space-8));
}

.lp-footer__brand {
  align-items: center;
  color: var(--color-ink);
  display: inline-flex;
  font-family: var(--font-display);
  font-weight: 600;
  gap: var(--space-tight);
}

.lp-footer__links {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-5);
}

.lp-footer__links a {
  align-items: center;
  color: var(--color-text-muted);
  display: inline-flex;
  font-size: 0.875rem;
  min-height: 1.5rem;
  text-decoration: none;
}

.lp-footer__links a:hover {
  color: var(--color-ink);
}

.lp-footer__note {
  color: var(--color-text-faint);
  flex-basis: 100%;
  font-size: 0.75rem;
}

@media (min-width: 60rem) {
  .lp-nav__links {
    display: flex;
  }

  .lp-nav__toggle,
  .lp-nav__panel {
    display: none !important;
  }

  .lp-features {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  /* Deux lignes de titre réservées : descriptions et liens s'alignent dans la
     grille 3 × 2. Inutile en une colonne, où cela rallonge la page. */
  .lp-feature h3,
  .lp-tool h3 {
    min-height: 2.6em;
  }

  .lp-hero {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
  }

  .lp-security {
    align-items: center;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  }
}

@media (max-width: 40rem) {
  .lp-nav__login,
  .lp-nav__cta {
    display: none;
  }

  /* Le CTA principal reste accessible dans le panneau, en pleine largeur. */
  .lp-nav__panel-cta {
    justify-content: center;
    margin-top: var(--space-3);
    width: 100%;
  }
}
</style>
