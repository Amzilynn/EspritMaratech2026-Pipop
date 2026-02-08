<script setup lang="ts">
import { ref } from 'vue';
import { useVoiceAssistant } from '@/composables/useVoiceAssistant'

const { ttsEnabled, currentlySpeaking, speak, stopSpeaking } = useVoiceAssistant()

const onHoverPartner = (name: string) => speak(`Partenaire : ${name}.`, 'partner-' + name)
const onHoverBreadcam = () => speak(`Vous êtes dans la section Nos Partenaires.`, 'bradcam')

const partners = ref([
    { id: 1, name: 'Digital Natives', src: 'https://placehold.co/200x100?text=Digital+Natives' },
    { id: 2, name: 'Natilait', src: 'https://placehold.co/200x100?text=Natilait' },
    { id: 3, name: 'Baby Motif', src: 'https://placehold.co/200x100?text=Baby+Motif' },
    { id: 4, name: 'XUL Print', src: 'https://placehold.co/200x100?text=XUL+Print' },
    { id: 5, name: 'Koukou Kafe', src: 'https://placehold.co/200x100?text=Koukou+Kafe' },
    { id: 6, name: 'Parcel', src: 'https://placehold.co/200x100?text=Parcel' },
    { id: 7, name: 'LBM', src: 'https://placehold.co/200x100?text=LBM' },
]);
</script>

<template>
    <div class="partners-page">
        <!-- Page Header -->
        <div class="page-header-omnia" @mouseenter="onHoverBreadcam" @mouseleave="stopSpeaking">
            <div class="container-omnia">
                <h1>NOS PARTENAIRES</h1>
                <p>Ils nous accordent leur confiance et soutiennent nos missions au quotidien.</p>
            </div>
        </div>

        <section class="section-padding container-omnia">
            <div class="section-header text-center">
                <h2>UN RÉSEAU DE SOLIDARITÉ</h2>
                <div class="section-line"></div>
                <p class="max-600 mx-auto">Grâce à ces entreprises et institutions, nous pouvons multiplier l'impact de nos actions humanitaires en Tunisie.</p>
            </div>

            <div class="partners-grid mt-5">
                <div 
                    v-for="partner in partners" 
                    :key="partner.id" 
                    class="partner-item"
                    @mouseenter="onHoverPartner(partner.name)"
                    @mouseleave="stopSpeaking"
                >
                    <div 
                        class="card-omnia partner-card"
                        :class="{ 'tts-highlight': currentlySpeaking === 'partner-' + partner.name }"
                    >
                        <img :src="partner.src" :alt="'Logo de ' + partner.name">
                        <div class="partner-overlay">
                            <span>{{ partner.name }} <i v-if="ttsEnabled && currentlySpeaking === 'partner-' + partner.name" class="fa fa-assistive-listening-systems tts-pulse-icon"></i></span>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Partnership CTA -->
        <section class="section-padding bg-light-blue">
            <div class="container-omnia text-center">
                <div class="card-omnia cta-card bg-primary-blue text-white">
                    <h2>Devenir Partenaire ?</h2>
                    <p class="mb-4">Votre entreprise souhaite s'engager socialement ? Rejoignez l'aventure Omnia.</p>
                    <router-link to="/contact" class="btn-omnia btn-accent">NOUS CONTACTER</router-link>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.bg-light-blue { background-color: var(--light-blue); }
.bg-primary-blue { background-color: var(--primary-blue); color: white !important; }

.section-line {
    width: 50px;
    height: 4px;
    background: var(--accent-gold);
    margin: var(--spacing-sm) auto var(--spacing-xl);
}

.max-600 { max-width: 600px; }
.mx-auto { margin-left: auto; margin-right: auto; }

.partners-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: var(--spacing-xl);
}

.partner-card {
    height: 140px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-lg);
    position: relative;
    overflow: hidden;
}

.partner-card img {
    max-width: 100%;
    max-height: 100%;
    filter: grayscale(100%);
    opacity: 0.6;
    transition: all 0.3s;
}

.partner-card:hover img {
    filter: grayscale(0%);
    opacity: 1;
    transform: scale(1.1);
}

.partner-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    background: rgba(22, 59, 92, 0.9);
    padding: 10px;
    color: white;
    font-size: 14px;
    font-weight: 700;
    text-align: center;
    transform: translateY(100%);
    transition: transform 0.3s;
}

.partner-card:hover .partner-overlay {
    transform: translateY(0);
}

.cta-card {
    padding: var(--spacing-xxl);
}
.cta-card h2 { color: white; font-size: 2.5rem; }
.cta-card p { font-size: 1.4rem; opacity: 1; color: #FFFFFF; font-weight: 500; }

.mt-5 { margin-top: 3rem; }
</style>