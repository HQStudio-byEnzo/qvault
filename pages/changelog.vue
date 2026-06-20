<template><div class="min-h-screen bg-surface-950 text-white"><main class="max-w-4xl mx-auto px-6 py-16"><NuxtLink to="/" class="text-accent-300 text-sm">← Back</NuxtLink><h1 class="text-4xl font-semibold mt-6 mb-3">BitLock changelog</h1><p class="text-surface-400 mb-10">Follow product updates, fixes, and improvements.</p><div class="space-y-6"><article v-for="entry in entries" :key="entry.version" class="card"><div class="flex items-center justify-between gap-4 mb-3"><h2 class="text-xl font-semibold">{{ entry.version }}</h2><time class="text-sm text-surface-500">{{ entry.date }}</time></div><ul class="space-y-2 text-surface-300"><li v-for="item in entry.items" :key="item">• {{ item }}</li></ul></article></div></main></div></template>
<script setup lang="ts">
definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Changelog - BitLock', description: 'BitLock product updates, fixes, and improvements.' })
const entries = [{ version: '2026.06', date: 'June 19, 2026', items: ['BitLock rename and corrected legal pages.', 'Recovery code storage with .txt import.', 'Public password generator accessible without an account.', 'Cleaner interface and refreshed landing page.'] }]
</script>
