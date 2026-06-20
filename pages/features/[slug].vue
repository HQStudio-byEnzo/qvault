<template>
  <div class="min-h-screen bg-surface-950 text-white">
    <main v-if="feature" class="max-w-6xl mx-auto px-6 py-16 grid lg:grid-cols-[1.2fr_0.8fr] gap-10">
      <section class="space-y-6">
        <NuxtLink to="/features" class="inline-flex items-center gap-2 text-sm text-accent-300 hover:text-accent-200">
          <Icon name="lucide:arrow-left" class="w-4 h-4" />
          Back to features
        </NuxtLink>
        <div class="space-y-4">
          <div class="w-14 h-14 rounded-2xl flex items-center justify-center" :class="feature.badgeClass">
            <Icon :name="feature.icon" class="w-6 h-6" :class="feature.iconClass" />
          </div>
          <h1 class="text-4xl md:text-5xl font-semibold tracking-tight">{{ feature.title }}</h1>
          <p class="text-lg text-surface-400 leading-relaxed max-w-2xl">{{ feature.summary }}</p>
        </div>

        <div class="grid gap-4">
          <article v-for="point in feature.points" :key="point" class="card">
            <p class="text-surface-300 leading-relaxed">{{ point }}</p>
          </article>
        </div>
      </section>

      <aside class="space-y-4">
        <div class="card space-y-4">
          <h2 class="text-lg font-semibold">What you get</h2>
          <ul class="space-y-3 text-sm text-surface-300">
            <li v-for="item in feature.points" :key="item">• {{ item }}</li>
          </ul>
        </div>
        <div class="card space-y-4">
          <h2 class="text-lg font-semibold">Related actions</h2>
          <div class="flex flex-col gap-3">
            <NuxtLink v-if="feature.slug === 'recovery'" to="/dashboard/recovery-codes" class="btn-primary text-center">Open recovery codes</NuxtLink>
            <NuxtLink v-else to="/auth/register" class="btn-primary text-center">Create a vault</NuxtLink>
            <NuxtLink v-if="feature.slug === 'passwords'" to="/generateur-mot-de-passe" class="btn-secondary text-center">Use the password generator</NuxtLink>
          </div>
        </div>
      </aside>
    </main>

    <main v-else class="max-w-4xl mx-auto px-6 py-16">
      <NuxtLink to="/features" class="inline-flex items-center gap-2 text-sm text-accent-300 hover:text-accent-200">
        <Icon name="lucide:arrow-left" class="w-4 h-4" />
        Back to features
      </NuxtLink>
      <div class="card mt-6">
        <h1 class="text-2xl font-semibold">Feature not found</h1>
        <p class="text-surface-400 mt-2">The requested feature page does not exist.</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' })

const route = useRoute()
const { getFeature } = useFeatureCatalog()
const feature = computed(() => getFeature(String(route.params.slug)))

useSeoMeta({
  title: feature.value ? `${feature.value.title} - BitLock` : 'Feature - BitLock',
  description: feature.value?.summary || 'BitLock feature page.',
})
</script>
