<script setup lang="ts">
import { useVoiceAssistant } from '@/composables/useVoiceAssistant'

const { ttsEnabled, currentlySpeaking, speak, stopSpeaking } = useVoiceAssistant()

// Voice Handlers
const onHoverHero = () => speak("Bienvenue sur Omnia. Joindre la sympathie au soutien financier et moral. Nous sommes une association humanitaire à but non lucratif.", 'hero')
const onHoverCause = (title: string) => speak(`Notre cause : ${title}.`, 'cause-' + title)
const onHoverAbout = () => speak("À propos de nous. Omnia est née de la volonté de jeunes Tunisiens désirant réaliser des missions humanitaires pour aider les personnes défavorisées, âgées ou à mobilité réduite.", 'about')
const onHoverStat = (count: string, label: string) => speak(`${count} ${label}.`, 'stat-' + label)
const onHoverAction = (title: string, desc: string) => speak(`Action : ${title}. ${desc}`, 'action-' + title)
const onHoverPartner = (name: string) => speak(`Partenaire : ${name}.`, 'partner-' + name)
const onHoverTestimonial = (name: string, text: string) => speak(`Témoignage de ${name} : ${text}`, 'testimonial')
const onHoverDonationForm = () => speak("Formulaire de don. Choisissez un montant pour aider l'association.", 'donation-form')
</script>

<template>
    <div class="home-page">
        <!-- Hero Section -->
        <section class="hero-section" aria-labelledby="hero-title" @mouseenter="onHoverHero" @mouseleave="stopSpeaking">
            <div class="hero-overlay" :class="{ 'tts-highlight': currentlySpeaking === 'hero' }">
                <div class="container-omnia">
                    <div class="hero-content">
                        <p class="hero-tagline">Association Humanitaire Omnia</p>
                        <h1 id="hero-title">JOINDRE LA SYMPATHIE AU SOUTIEN FINANCIER ET MORAL <i v-if="ttsEnabled && currentlySpeaking === 'hero'" class="fa fa-assistive-listening-systems tts-pulse-icon"></i></h1>
                        <p class="hero-desc">
                            Omnia est une association humanitaire à but non lucratif née de la volonté 
                            de jeunes Tunisiens désirant réaliser des missions humanitaires pour aider 
                            ceux qui en ont le plus besoin.
                        </p>
                        <div class="hero-actions">
                            <router-link to="/donate" class="btn-omnia btn-accent">FAIRE UN DON</router-link>
                            <a href="#about" class="btn-omnia btn-outline" style="color: white; border-color: white;">EN SAVOIR PLUS</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Causes Section -->
        <section class="section-padding container-omnia" aria-labelledby="causes-title">
            <div class="section-header text-center">
                <h2 id="causes-title">NOTRE CAUSE</h2>
                <div class="section-line"></div>
            </div>

            <div class="causes-grid">
                <div class="card-omnia cause-card" @mouseenter="onHoverCause('Assistance aux Personnes Défavorisées')" @mouseleave="stopSpeaking" :class="{ 'tts-highlight': currentlySpeaking?.startsWith('cause-') }">
                    <div class="cause-icon"><i class="fa fa-handshake-o"></i></div>
                    <h3>Personnes Défavorisées</h3>
                    <p>Soutien concret et assistance directe aux familles et individus en situation de précarité.</p>
                </div>
                <div class="card-omnia cause-card" @mouseenter="onHoverCause('Assistance aux Personnes Âgées')" @mouseleave="stopSpeaking">
                    <div class="cause-icon"><i class="fa fa-heartbeat"></i></div>
                    <h3>Personnes Âgées</h3>
                    <p>Accompagnement attentif et respectueux pour nos aînés, garantissant dignité et affection.</p>
                </div>
                <div class="card-omnia cause-card" @mouseenter="onHoverCause('Personnes à Mobilité Réduite')" @mouseleave="stopSpeaking">
                    <div class="cause-icon"><i class="fa fa-wheelchair"></i></div>
                    <h3>Mobilité Réduite</h3>
                    <p>Aide logistique et matérielle pour faciliter le quotidien des personnes en situation de handicap.</p>
                </div>
                <div class="card-omnia cause-card" @mouseenter="onHoverCause('Travail Social')" @mouseleave="stopSpeaking">
                    <div class="cause-icon"><i class="fa fa-users"></i></div>
                    <h3>Travail Social</h3>
                    <p>Contribution active au développement social par des projets communautaires durables.</p>
                </div>
            </div>
        </section>

        <!-- About Section -->
        <section id="about" class="about-section" @mouseenter="onHoverAbout" @mouseleave="stopSpeaking" :class="{ 'tts-highlight': currentlySpeaking === 'about' }">
            <div class="container-omnia d-flex align-items-center flex-wrap">
                <div class="about-image d-none d-lg-block">
                    <img src="/img/banner/banner.png" alt="Membres de l'association Omnia en action" class="rounded-lg shadow-lg">
                </div>
                <div class="about-content">
                    <div class="section-header">
                        <h2>À PROPOS DE NOUS <i v-if="ttsEnabled && currentlySpeaking === 'about'" class="fa fa-assistive-listening-systems tts-pulse-icon"></i></h2>
                    </div>
                    <p class="lead">Omnia: "Tout" en latin. Parce que nous croyons que chaque geste compte.</p>
                    <p>Notre association est née en 2011, portée par une jeunesse tunisienne engagée. Nous ne nous contentons pas d'apporter une aide financière ; nous offrons notre affection et notre temps pour rompre l'isolement social.</p>
                    <p>Nous intervenons sur tout le territoire pour identifier les besoins urgents et y répondre avec rapidité et transparence.</p>
                    <router-link to="/bureau" class="btn-omnia btn-primary mt-4">DÉCOUVRIR NOTRE ÉQUIPE</router-link>
                </div>
            </div>
        </section>

        <!-- Stats Section -->
        <section class="stats-section">
            <div class="container-omnia">
                <div class="stats-grid">
                    <div class="stat-item" @mouseenter="onHoverStat('95', 'Actions')" @mouseleave="stopSpeaking">
                        <div class="stat-number">95</div>
                        <div class="stat-label">ACTIONS RÉALISÉES</div>
                    </div>
                    <div class="stat-item" @mouseenter="onHoverStat('34', 'Membres')" @mouseleave="stopSpeaking">
                        <div class="stat-number">34</div>
                        <div class="stat-label">BÉNÉVOLES ACTIFS</div>
                    </div>
                    <div class="stat-item" @mouseenter="onHoverStat('2000', 'Personnes Aidées')" @mouseleave="stopSpeaking">
                        <div class="stat-number">2000</div>
                        <div class="stat-label">PERSONNES AIDÉES</div>
                    </div>
                    <div class="stat-item" @mouseenter="onHoverStat('4', 'Années')" @mouseleave="stopSpeaking">
                        <div class="stat-number">4</div>
                        <div class="stat-label">ANNÉES D'EXPÉRIENCE</div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Partners Section -->
        <section class="section-padding container-omnia">
            <div class="section-header text-center">
                <h2>NOS PARTENAIRES</h2>
                <p>Ils nous font confiance et soutiennent nos missions.</p>
            </div>
            <div class="partners-carousel">
                <div class="partner-logo" @mouseenter="onHoverPartner('Digital Natives')" @mouseleave="stopSpeaking">
                    <img src="https://placehold.co/180x80?text=Digital+Natives" alt="Logo Digital Natives">
                </div>
                <div class="partner-logo" @mouseenter="onHoverPartner('Natilait')" @mouseleave="stopSpeaking">
                    <img src="https://placehold.co/180x80?text=Natilait" alt="Logo Natilait">
                </div>
                <div class="partner-logo" @mouseenter="onHoverPartner('Baby Motif')" @mouseleave="stopSpeaking">
                    <img src="https://placehold.co/180x80?text=Baby+Motif" alt="Logo Baby Motif">
                </div>
                <div class="partner-logo" @mouseenter="onHoverPartner('Koukou Kafe')" @mouseleave="stopSpeaking">
                    <img src="https://placehold.co/180x80?text=Koukou+Kafe" alt="Logo Koukou Kafe">
                </div>
            </div>
        </section>

        <!-- Donation CTA Section -->
        <section class="donation-cta-section section-padding">
            <div class="container-omnia text-center" @mouseenter="onHoverDonationForm" @mouseleave="stopSpeaking">
                <h2 class="text-white">PRÊT À NOUS AIDER ?</h2>
                <p class="text-white opacity-90 mb-5">Chaque dinar est investi directement dans nos actions sur le terrain.</p>
                <router-link to="/donate" class="btn-omnia btn-accent btn-lg">FAIRE UN DON MAINTENANT</router-link>
            </div>
        </section>
    </div>
</template>

<style scoped>
.hero-section {
    background-image: url('/img/banner/banner.png');
    background-size: cover;
    background-position: center;
    min-height: 80vh;
    display: flex;
    align-items: center;
}

.hero-overlay {
    width: 100%;
    min-height: 80vh;
    background: linear-gradient(135deg, rgba(22, 59, 92, 0.9) 0%, rgba(43, 126, 193, 0.6) 100%);
    display: flex;
    align-items: center;
    transition: background 0.5s;
}

.hero-content {
    max-width: 800px;
    color: white;
}

.hero-tagline {
    font-weight: 700;
    color: var(--accent-gold);
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: var(--spacing-sm);
}

.hero-content h1 {
    color: white;
    font-weight: 800;
    margin-bottom: var(--spacing-md);
}

.hero-desc {
    font-size: 1.5rem;
    line-height: 1.6;
    margin-bottom: var(--spacing-xl);
    opacity: 1;
    color: #FFFFFF;
}

.hero-actions {
    display: flex;
    gap: var(--spacing-md);
    flex-wrap: wrap;
}

.section-line {
    width: 60px;
    height: 4px;
    background: var(--accent-gold);
    margin: var(--spacing-sm) auto var(--spacing-xl);
}

.causes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-lg);
}

.cause-card {
    text-align: center;
    transition: transform 0.3s, box-shadow 0.3s;
}

.cause-card:hover {
    transform: translateY(-10px);
    border-color: var(--primary-blue);
}

.cause-icon {
    font-size: 40px;
    color: var(--primary-blue);
    margin-bottom: var(--spacing-md);
}

.about-section {
    background-color: var(--white);
    padding: var(--spacing-xxl) 0;
}

.about-image {
    flex: 1;
    min-width: 300px;
    padding: var(--spacing-lg);
}

.about-image img {
    width: 100%;
    border-radius: var(--radius-lg);
}

.about-content {
    flex: 1;
    min-width: 300px;
    padding: var(--spacing-lg);
}

.lead {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--secondary-blue);
    margin-bottom: var(--spacing-md);
}

.stats-section {
    background: var(--secondary-blue);
    padding: var(--spacing-xxl) 0;
    color: white;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: var(--spacing-xl);
}

.stat-item {
    text-align: center;
}

.stat-number {
    font-size: 3.5rem;
    font-weight: 800;
    margin-bottom: var(--spacing-xs);
    color: var(--accent-gold);
}

.stat-label {
    font-weight: 700;
    letter-spacing: 1px;
    font-size: 1.1rem;
    opacity: 1;
    color: #FFFFFF;
}

.partners-carousel {
    display: flex;
    justify-content: space-around;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--spacing-xl);
    margin-top: var(--spacing-xl);
}

.partner-logo {
    opacity: 0.6;
    transition: opacity 0.3s, transform 0.3s;
    filter: grayscale(100%);
}

.partner-logo:hover {
    opacity: 1;
    transform: scale(1.1);
    filter: grayscale(0%);
}

.donation-cta-section {
    background: linear-gradient(rgba(22, 59, 92, 0.8), rgba(22, 59, 92, 0.8)), url('/img/banner/banner.png');
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
}

.rounded-lg { border-radius: 12px; }
.shadow-lg { box-shadow: 0 10px 30px rgba(0,0,0,0.2); }
.mt-4 { margin-top: 1.5rem; }
.mb-5 { margin-bottom: 3rem; }
.text-white { color: white !important; }
.opacity-90 { opacity: 0.9; }
</style>
