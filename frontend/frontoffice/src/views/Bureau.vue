<script setup lang="ts">
import { useVoiceAssistant } from '@/composables/useVoiceAssistant'

const { ttsEnabled, currentlySpeaking, speak, stopSpeaking } = useVoiceAssistant()

const onHoverMember = (name: string, role: string) => speak(`Membre du bureau : ${name}, ${role}.`, 'member-' + name)
const onHoverBreadcam = () => speak(`Vous êtes dans la section Notre Bureau.`, 'bradcam')

const leaders = [
    { name: 'MOURAD ARFAOUI', role: 'Le Président', img: '/img/volenteer/1.png' },
    { name: 'RACHIDA BEN HASSINE', role: 'Vice Présidente', img: '/img/volenteer/2.png' }
]

const team = [
    { name: 'KAOUTHER ZOGHBI', role: 'Trésorière', img: '/img/volenteer/3.png' },
    { name: 'RAMY KHADDOUMA', role: 'Secrétaire Général', img: '/img/volenteer/1.png' },
    { name: 'SONIA BOULAABI', role: 'Ressources Humaines', img: '/img/volenteer/2.png' },
    { name: 'KHAOULA ZAAIBI', role: 'Responsable Communication', img: '/img/volenteer/3.png' }
]
</script>

<template>
    <div class="bureau-page">
        <!-- Page Header -->
        <div class="page-header-omnia" @mouseenter="onHoverBreadcam" @mouseleave="stopSpeaking">
            <div class="container-omnia">
                <h1>NOTRE BUREAU</h1>
                <p>Découvrez les visages derrière nos actions humanitaires.</p>
            </div>
        </div>

        <!-- Leaders Section -->
        <section class="section-padding container-omnia">
            <div class="section-header text-center">
                <h2>NOS DIRIGEANTS</h2>
                <div class="section-line"></div>
            </div>

            <div class="team-grid top-leaders">
                <div 
                    v-for="member in leaders" 
                    :key="member.name"
                    class="card-omnia team-card"
                    @mouseenter="onHoverMember(member.name, member.role)"
                    @mouseleave="stopSpeaking"
                    :class="{ 'tts-highlight': currentlySpeaking === 'member-' + member.name }"
                >
                    <div class="team-img-wrapper">
                        <img :src="member.img" :alt="'Portrait de ' + member.name">
                    </div>
                    <div class="team-content">
                        <h3>{{ member.name }} <i v-if="ttsEnabled && currentlySpeaking === 'member-' + member.name" class="fa fa-assistive-listening-systems tts-pulse-icon"></i></h3>
                        <p class="role-text">{{ member.role }}</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- Team Section -->
        <section class="section-padding bg-light-blue">
            <div class="container-omnia">
                <div class="section-header text-center">
                    <h2>L'ÉQUIPE OPÉRATIONNELLE</h2>
                    <div class="section-line"></div>
                </div>

                <div class="team-grid">
                    <div 
                        v-for="member in team" 
                        :key="member.name"
                        class="card-omnia team-card"
                        @mouseenter="onHoverMember(member.name, member.role)"
                        @mouseleave="stopSpeaking"
                        :class="{ 'tts-highlight': currentlySpeaking === 'member-' + member.name }"
                    >
                        <div class="team-img-wrapper">
                            <img :src="member.img" :alt="'Portrait de ' + member.name">
                        </div>
                        <div class="team-content">
                            <h3>{{ member.name }} <i v-if="ttsEnabled && currentlySpeaking === 'member-' + member.name" class="fa fa-assistive-listening-systems tts-pulse-icon"></i></h3>
                            <p class="role-text">{{ member.role }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Mission CTA -->
        <section class="section-padding container-omnia text-center">
            <div class="card-omnia join-card bg-primary-blue text-white">
                <h2>Bénévole ?</h2>
                <p class="mb-4">Vous souhaitez rejoindre notre bureau ou nous aider sur le terrain ?</p>
                <router-link to="/contact" class="btn-omnia btn-accent">NOUS CONTACTER</router-link>
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

.team-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--spacing-xl);
}

.top-leaders {
    max-width: 900px;
    margin: 0 auto;
}

.team-card {
    padding: 0;
    overflow: hidden;
    text-align: center;
    border-bottom: 5px solid var(--primary-blue);
    transition: transform 0.3s;
}

.team-card:hover {
    transform: translateY(-8px);
}

.team-img-wrapper {
    height: 350px;
    overflow: hidden;
}

.team-img-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
}

.team-card:hover .team-img-wrapper img {
    transform: scale(1.05);
}

.team-content {
    padding: var(--spacing-lg);
}

.team-content h3 {
    font-size: 22px;
    margin-bottom: var(--spacing-xs);
    color: var(--dark-blue);
}

.role-text {
    color: var(--secondary-blue);
    font-weight: 800;
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.join-card {
    padding: var(--spacing-xxl);
}

.join-card h2 { color: white; font-size: 2.5rem; }
.join-card p { opacity: 1; font-size: 1.4rem; color: #FFFFFF; font-weight: 500; }

@media (max-width: 768px) {
    .team-img-wrapper { height: 300px; }
}
</style>
