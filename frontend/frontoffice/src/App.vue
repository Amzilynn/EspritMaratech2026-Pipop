<script setup lang="ts">
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import HeaderOmnia from '@/components/HeaderOmnia.vue'
import FooterOmnia from '@/components/FooterOmnia.vue'
import GestureControl from '@/components/GestureControl.vue'

const route = useRoute()
const isLoggedIn = computed(() => {
    return !!localStorage.getItem('access_token')
})

const showLayout = computed(() => route.meta.layout !== 'simple')
</script>

<template>
  <div class="omnia-layout">
    <HeaderOmnia v-if="showLayout" :is-logged-in="isLoggedIn" />
    <main id="main-content" role="main" :class="{ 'simple-layout': !showLayout }">
      <RouterView />
    </main>
    <FooterOmnia v-if="showLayout" />
    <GestureControl />
  </div>
</template>

<style>
.omnia-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

#main-content {
  flex: 1;
}

/* Accessibility: skip to main content (optional but good) */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--accent-gold);
  color: white;
  padding: 8px;
  z-index: 1001;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 0;
}
</style>
