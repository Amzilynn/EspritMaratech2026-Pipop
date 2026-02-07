<script setup>
const props = defineProps({ item: Object, level: Number });
</script>

<template>
  <template v-if="typeof item === 'string'">
    <v-icon :icon="item" :size="level > 0 ? 16 : 20" class="iconClass"></v-icon>
  </template>
  <template v-else>
    <template v-if="level > 0">
      <component
        :is="item"
        size="5"
        fill="currentColor"
        stroke-width="1.5"
        class="iconClass"
      ></component>
    </template>
    <template v-else>
      <component
        :is="item"
        size="20"
        stroke-width="1.5"
        class="iconClass"
      ></component>
    </template>
  </template>
</template>
