<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>
<template>
    <div class="logo">
        <RouterLink to="/" class="d-flex align-center text-decoration-none">
            <span class="omnia-brand">
                <span class="text-primary">Omn</span>
                <span class="text-error heart-i">i</span>
                <span class="text-primary">a</span>
            </span>
        </RouterLink>
    </div>
</template>

<style scoped>
.omnia-brand {
    font-size: 2.25rem;
    font-weight: 800;
    letter-spacing: -0.5px;
}
.heart-i {
    position: relative;
    display: inline-block;
}
</style>
