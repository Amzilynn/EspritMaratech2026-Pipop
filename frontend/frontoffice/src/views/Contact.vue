<script setup lang="ts">
import { ref } from 'vue';
import { useVoiceAssistant } from '@/composables/useVoiceAssistant'

const { ttsEnabled, currentlySpeaking, speak, stopSpeaking } = useVoiceAssistant()

const contactForm = ref({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
});

const submitForm = () => {
    console.log('Form submitted:', contactForm.value);
    alert('Votre message a été envoyé !');
    contactForm.value = { firstName: '', lastName: '', email: '', message: '' };
};

// Voice Handlers
const onHoverBreadcam = () => speak("Contactez-nous. Retrouvez nos coordonnées et envoyez-nous un message.", 'bradcam')
const onHoverInfo = (label: string, value: string) => speak(`${label} : ${value}.`, 'info-' + label)
const onHoverField = (label: string) => speak(`Champ de saisie pour ${label}.`, 'field-' + label)
</script>

<template>
    <div class="contact-page">
        <!-- Page Header -->
        <div class="page-header-omnia" @mouseenter="onHoverBreadcam" @mouseleave="stopSpeaking">
            <div class="container-omnia">
                <h1>CONTACT</h1>
                <p>Une question ? Un projet ? Notre équipe est à votre écoute.</p>
            </div>
        </div>

        <section class="section-padding container-omnia">
            <div class="contact-grid">
                <!-- Contact Info Cards -->
                <div class="info-sidebar">
                    <div 
                        class="card-omnia info-card" 
                        @mouseenter="onHoverInfo('Adresse', '16 rue palestine, Lafayette, Tunis')" 
                        @mouseleave="stopSpeaking"
                        :class="{ 'tts-highlight': currentlySpeaking === 'info-Adresse' }"
                    >
                        <div class="info-icon"><i class="fa fa-map-marker"></i></div>
                        <h3>ADRESSE <i v-if="ttsEnabled && currentlySpeaking === 'info-Adresse'" class="fa fa-assistive-listening-systems tts-pulse-icon"></i></h3>
                        <p>16 rue palestine, 1002 Lafayette, Tunisie</p>
                    </div>

                    <div 
                        class="card-omnia info-card" 
                        @mouseenter="onHoverInfo('Email', 'omniatn.charity@gmail.com')" 
                        @mouseleave="stopSpeaking"
                        :class="{ 'tts-highlight': currentlySpeaking === 'info-Email' }"
                    >
                        <div class="info-icon"><i class="fa fa-envelope"></i></div>
                        <h3>EMAIL <i v-if="ttsEnabled && currentlySpeaking === 'info-Email'" class="fa fa-assistive-listening-systems tts-pulse-icon"></i></h3>
                        <p><a href="mailto:omniatn.charity@gmail.com">omniatn.charity@gmail.com</a></p>
                    </div>

                    <div 
                        class="card-omnia info-card" 
                        @mouseenter="onHoverInfo('Téléphone', '98 534 849')" 
                        @mouseleave="stopSpeaking"
                        :class="{ 'tts-highlight': currentlySpeaking === 'info-Téléphone' }"
                    >
                        <div class="info-icon"><i class="fa fa-phone"></i></div>
                        <h3>TÉLÉPHONE <i v-if="ttsEnabled && currentlySpeaking === 'info-Téléphone'" class="fa fa-assistive-listening-systems tts-pulse-icon"></i></h3>
                        <p><a href="tel:+21698534849">(+216) 98 534 849</a></p>
                    </div>
                </div>

                <!-- Contact Form -->
                <div class="form-container">
                    <div class="card-omnia shadow-lg">
                        <div class="card-header-omnia">
                            <h2>ENVOYEZ UN MESSAGE</h2>
                            <p>Nous vous répondrons dans les plus brefs délais.</p>
                        </div>
                        <form @submit.prevent="submitForm" class="p-4">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <div class="form-group-omnia" :class="{ 'tts-highlight': currentlySpeaking === 'field-Prénom' }">
                                        <label @mouseenter="onHoverField('Prénom')" @mouseleave="stopSpeaking">PRÉNOM *</label>
                                        <input v-model="contactForm.firstName" type="text" class="form-control-omnia" placeholder="Votre prénom" required>
                                    </div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <div class="form-group-omnia" :class="{ 'tts-highlight': currentlySpeaking === 'field-Nom' }">
                                        <label @mouseenter="onHoverField('Nom')" @mouseleave="stopSpeaking">NOM *</label>
                                        <input v-model="contactForm.lastName" type="text" class="form-control-omnia" placeholder="Votre nom" required>
                                    </div>
                                </div>
                            </div>
                            <div class="form-group-omnia mb-3" :class="{ 'tts-highlight': currentlySpeaking === 'field-Email' }">
                                <label @mouseenter="onHoverField('Email')" @mouseleave="stopSpeaking">ADRESSE EMAIL *</label>
                                <input v-model="contactForm.email" type="email" class="form-control-omnia" placeholder="votre@email.com" required>
                            </div>
                            <div class="form-group-omnia mb-4" :class="{ 'tts-highlight': currentlySpeaking === 'field-Message' }">
                                <label @mouseenter="onHoverField('Message')" @mouseleave="stopSpeaking">MESSAGE *</label>
                                <textarea v-model="contactForm.message" class="form-control-omnia" rows="5" placeholder="Comment pouvons-nous vous aider ?" required></textarea>
                            </div>
                            <button type="submit" class="btn-omnia btn-primary w-100">ENVOYER LE MESSAGE</button>
                        </form>
                    </div>
                </div>
            </div>
        </section>

        <!-- Map Placeholder -->
        <section class="map-section">
            <div class="map-placeholder">
                <i class="fa fa-map-o"></i>
                <p>CARTE INTERACTIVE - TUNIS LAFAYETTE</p>
            </div>
        </section>
    </div>
</template>

<style scoped>
.contact-grid {
    display: grid;
    grid-template-columns: 350px 1fr;
    gap: var(--spacing-xxl);
}

.info-sidebar {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
}

.info-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: var(--spacing-xl);
}

.info-icon {
    width: 60px;
    height: 60px;
    background: var(--light-blue);
    color: var(--primary-blue);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    margin-bottom: var(--spacing-md);
    transition: all 0.3s;
}

.info-card:hover .info-icon {
    background: var(--primary-blue);
    color: white;
}

.info-card h3 {
    font-size: 20px;
    letter-spacing: 1.5px;
    color: var(--secondary-blue);
    margin-bottom: var(--spacing-sm);
    font-weight: 800;
}

.info-card p, .info-card a {
    color: var(--text-dark);
    font-weight: 600;
    font-size: 1.1rem;
    text-decoration: none;
}

.card-header-omnia {
    background: var(--light-blue);
    padding: var(--spacing-xl);
    text-align: center;
    border-bottom: 2px solid var(--border-color);
}

.card-header-omnia h2 {
    font-size: 28px;
    color: var(--secondary-blue);
    margin-bottom: 8px;
}

.card-header-omnia p {
    color: var(--text-dark);
    font-size: 1.1rem;
    font-weight: 500;
}

.map-section {
    padding-bottom: var(--spacing-xxl);
}

.map-placeholder {
    height: 400px;
    background: #f0f2f5;
    border: 1px solid var(--border-color);
    margin: 0 var(--spacing-lg);
    border-radius: var(--radius-lg);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: var(--text-muted);
    gap: 15px;
}

.map-placeholder i { font-size: 50px; }

@media (max-width: 992px) {
    .contact-grid { grid-template-columns: 1fr; }
}
</style>