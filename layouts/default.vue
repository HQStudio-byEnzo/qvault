<template>
  <div class="min-h-screen bg-surface-950 text-surface-100 relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0">
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.16]"></div>
      <div class="absolute top-[-18rem] left-1/2 h-[30rem] w-[56rem] -translate-x-1/2 rounded-full bg-accent-600/12 blur-[140px]"></div>
      <div class="absolute right-[-8rem] top-1/4 h-80 w-80 rounded-full bg-accent-500/8 blur-[120px]"></div>
    </div>
    <div class="relative z-10">
      <UiBackToLanding />
      <slot />
    </div>
  </div>
</template>
