<script setup lang="ts">
import { ref } from 'vue';
import { useVoiceAssistant } from '@/composables/useVoiceAssistant'

const { ttsEnabled, currentlySpeaking, speak, stopSpeaking } = useVoiceAssistant()

const onHoverImage = (alt: string) => speak(`Image de la galerie : ${alt}.`, 'image-' + alt)
const onHoverBreadcam = () => speak(`Vous êtes dans la section Galerie Photo.`, 'bradcam')

const galleryImages = ref([
    { id: 1, src: '/img/causes/1.png', alt: 'Distribution de colis alimentaires' },
    { id: 2, src: '/img/causes/2.png', alt: 'Action hiver au chaud - vêtements' },
    { id: 3, src: '/img/causes/3.png', alt: 'Soutien aux enfants pour la rentrée' },
    { id: 4, src: '/img/causes/4.png', alt: 'Réparation d\'une maison insalubre' },
    { id: 5, src: '/img/causes/5.png', alt: 'Action médicale - pharmacie' },
    { id: 6, src: '/img/causes/6.png', alt: 'Rencontre avec les personnes âgées' },
    { id: 7, src: '/img/blog/single_blog_1.png', alt: 'Equipe Omnia sur le terrain' },
    { id: 8, src: '/img/blog/single_blog_2.png', alt: 'Collecte de dons en supermarché' },
    { id: 9, src: '/img/blog/single_blog_3.png', alt: 'Bureau de l\'association' },
]);
</script>

<template>
    <div class="gallery-page">
        <!-- Page Header -->
        <div class="page-header-omnia" @mouseenter="onHoverBreadcam" @mouseleave="stopSpeaking">
            <div class="container-omnia">
                <h1>GALERIE PHOTO</h1>
                <p>Nos actions en images à travers toute la Tunisie.</p>
            </div>
        </div>

        <section class="section-padding container-omnia">
            <div class="section-header text-center">
                <h2>NOS MOMENTS FORTS</h2>
                <div class="section-line"></div>
            </div>

            <div class="gallery-grid">
                <div 
                    v-for="image in galleryImages" 
                    :key="image.id" 
                    class="gallery-item-wrapper"
                    @mouseenter="onHoverImage(image.alt)"
                    @mouseleave="stopSpeaking"
                >
                    <div 
                        class="gallery-card card-omnia"
                        :class="{ 'tts-highlight': currentlySpeaking === 'image-' + image.alt }"
                    >
                        <div class="image-box">
                            <img :src="image.src" :alt="image.alt" class="img-fluid">
                            <div class="image-overlay">
                                <span class="zoom-icon"><i class="fa fa-search-plus"></i></span>
                                <i v-if="ttsEnabled && currentlySpeaking === 'image-' + image.alt" class="fa fa-assistive-listening-systems tts-pulse-icon overlay-pulse"></i>
                            </div>
                        </div>
                        <div class="image-caption">
                            {{ image.alt }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- More Images CTA -->
            <div class="text-center mt-5">
                <button class="btn-omnia btn-outline">CHARGER PLUS D'IMAGES</button>
            </div>
        </section>
    </div>
</template>

<style scoped>
.section-line {
    width: 50px;
    height: 4px;
    background: var(--accent-gold);
    margin: var(--spacing-sm) auto var(--spacing-xl);
}

.gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
    gap: var(--spacing-lg);
}

.gallery-item-wrapper {
    cursor: pointer;
}

.gallery-card {
    padding: 0;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.gallery-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
}

.image-box {
    position: relative;
    height: 240px;
    overflow: hidden;
}

.image-box img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.gallery-card:hover .image-box img {
    transform: scale(1.1);
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(22, 59, 92, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
}

.gallery-card:hover .image-overlay {
    opacity: 1;
}

.zoom-icon {
    font-size: 32px;
    color: white;
}

.overlay-pulse {
    position: absolute;
    bottom: 20px;
    right: 20px;
    font-size: 20px !important;
}

.image-caption {
    padding: var(--spacing-md);
    font-weight: 700;
    font-size: 18px;
    color: var(--dark-blue);
    text-align: center;
    background: var(--white);
    border-top: 1px solid var(--border-color);
}

.mt-5 { margin-top: 3rem; }
</style>