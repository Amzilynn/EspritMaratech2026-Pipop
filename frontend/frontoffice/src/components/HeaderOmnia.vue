<script setup lang="ts">
import { computed } from 'vue'
import { useVoiceAssistant } from '@/composables/useVoiceAssistant'

interface Props {
    isLoggedIn?: boolean
}

const props = defineProps<Props>()
const { ttsEnabled, currentlySpeaking, speak, stopSpeaking, toggleTts } = useVoiceAssistant()

const onHoverNav = (name: string) => speak(`Page : ${name}.`, 'nav-' + name)
const onHoverContact = (type: string, value: string) => speak(`Contact par ${type} : ${value}.`, 'contact-' + type)
const onHoverTts = () => speak(`Activation de la lecture vocale. État actuel : ${ttsEnabled.value ? 'activé' : 'désactivé'}.`, 'tts-toggle')
</script>

<template>
    <header class="header-omnia" role="banner">
        <!-- Top Bar Accessability Focus -->
        <div class="header-top">
            <div class="container-omnia d-flex justify-content-between align-items-center flex-wrap">
                <div class="contact-list" role="list">
                    <a href="tel:+21698534849" class="contact-item" @mouseenter="onHoverContact('téléphone', '98 534 849')" @mouseleave="stopSpeaking">
                        <i class="fa fa-phone" aria-hidden="true"></i>
                        <span>(+216) 98 534 849</span>
                        <span class="sr-only">Contact par téléphone</span>
                    </a>
                    <a href="mailto:omniatn.charity@gmail.com" class="contact-item" @mouseenter="onHoverContact('email', 'omniatn.charity@gmail.com')" @mouseleave="stopSpeaking">
                        <i class="fa fa-envelope" aria-hidden="true"></i>
                        <span>omniatn.charity@gmail.com</span>
                        <span class="sr-only">Contact par email</span>
                    </a>
                </div>

                <div class="header-actions">
                    <!-- Global Accessibility Utility -->
                    <button 
                        class="tts-toggle-pill" 
                        @click="toggleTts" 
                        :class="{ 'active': ttsEnabled }"
                        @mouseenter="onHoverTts"
                        @mouseleave="stopSpeaking"
                        :aria-label="ttsEnabled ? 'Désactiver la lecture vocale' : 'Activer la lecture vocale'"
                    >
                        <i class="fa" :class="ttsEnabled ? 'fa-volume-up' : 'fa-volume-off'" aria-hidden="true"></i>
                        <span>{{ ttsEnabled ? 'Lecture ON' : 'Lecture OFF' }}</span>
                    </button>

                    <div class="social-links d-none d-md-flex" aria-label="Réseaux sociaux">
                        <a href="#" aria-label="Facebook Omnia"><i class="fa fa-facebook"></i></a>
                        <a href="#" aria-label="Instagram Omnia"><i class="fa fa-instagram"></i></a>
                    </div>

                    <div class="auth-group">
                        <template v-if="!isLoggedIn">
                            <router-link to="/login" class="btn-auth signin" @mouseenter="onHoverNav('Connexion')" @mouseleave="stopSpeaking">Connexion</router-link>
                            <router-link to="/register" class="btn-auth signup" @mouseenter="onHoverNav('Inscription')" @mouseleave="stopSpeaking">Inscription</router-link>
                        </template>
                        <template v-else>
                            <router-link to="/profile" class="btn-auth profile" @mouseenter="onHoverNav('Mon Profil')" @mouseleave="stopSpeaking">
                                <i class="fa fa-user"></i> Profil
                            </router-link>
                        </template>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Navigation -->
        <div class="main-header" role="navigation" aria-label="Menu principal">
            <div class="container-omnia d-flex justify-content-between align-items-center">
                <div class="logo">
                    <router-link to="/" class="logo-text" aria-label="Retour à l'accueil Omnia">
                        Omnia
                    </router-link>
                </div>

                <nav class="nav-links d-none d-lg-block">
                    <ul>
                        <li><router-link to="/" @mouseenter="onHoverNav('Accueil')" @mouseleave="stopSpeaking">ACCUEIL</router-link></li>
                        <li><router-link to="/bureau" @mouseenter="onHoverNav('Bureau')" @mouseleave="stopSpeaking">BUREAU</router-link></li>
                        <li><router-link to="/actions" @mouseenter="onHoverNav('Actions')" @mouseleave="stopSpeaking">ACTIONS</router-link></li>
                        <li><router-link to="/galerie" @mouseenter="onHoverNav('Galerie')" @mouseleave="stopSpeaking">GALERIE</router-link></li>
                        <li><router-link to="/partners" @mouseenter="onHoverNav('Partenaires')" @mouseleave="stopSpeaking">PARTENAIRES</router-link></li>
                        <li><router-link to="/contact" @mouseenter="onHoverNav('Contact')" @mouseleave="stopSpeaking">CONTACT</router-link></li>
                    </ul>
                </nav>

                <div class="cta-header">
                    <router-link to="/donate" class="btn-donate" @mouseenter="onHoverNav('Faire un don')" @mouseleave="stopSpeaking">
                        FAIRE UN DON
                    </router-link>
                </div>
            </div>
        </div>
    </header>
</template>

<style scoped>
.header-omnia {
    position: sticky;
    top: 0;
    z-index: 1000;
    width: 100%;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.header-top {
    background-color: var(--dark-blue);
    color: white;
    padding: 8px 0;
    font-size: 14px;
}

.contact-list {
    display: flex;
    gap: 20px;
}

.contact-item {
    color: #FFFFFF;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: color 0.2s;
}

.contact-item:hover, .contact-item:focus {
    color: var(--accent-gold);
}

.header-actions {
    display: flex;
    align-items: center;
    gap: 16px;
}

.tts-toggle-pill {
    background: rgba(255,255,255,0.1);
    border: 1px solid rgba(255,255,255,0.3);
    color: white;
    padding: 6px 12px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s;
}

.tts-toggle-pill.active {
    background: var(--success-green);
    border-color: var(--success-green);
    box-shadow: 0 0 10px rgba(46, 125, 50, 0.5);
}

.social-links {
    display: flex;
    gap: 12px;
    border-left: 1px solid rgba(255,255,255,0.2);
    border-right: 1px solid rgba(255,255,255,0.2);
    padding: 0 16px;
}

.social_links a {
    color: rgba(255,255,255,0.7);
    transition: color 0.2s;
}

.social_links a:hover {
    color: var(--accent-gold);
}

.auth-group {
    display: flex;
    gap: 8px;
}

.btn-auth {
    padding: 6px 16px;
    border-radius: 20px;
    text-decoration: none;
    font-weight: 600;
    font-size: 13px;
    transition: all 0.2s;
}

.btn-auth.signin {
    color: white;
    border: 1px solid rgba(255,255,255,0.4);
}

.btn-auth.signup {
    background-color: var(--accent-gold);
    color: white;
    border: 1px solid var(--accent-gold);
}

.btn-auth.profile {
    background-color: var(--primary-blue);
    color: white;
    display: flex;
    align-items: center;
    gap: 6px;
}

.main-header {
    background-color: var(--primary-blue);
    padding: 16px 0;
}

.logo-text {
    font-size: 32px;
    font-weight: 800;
    color: white;
    text-decoration: none;
    letter-spacing: -0.5px;
}

.nav-links ul {
    list-style: none;
    display: flex;
    margin: 0;
    padding: 0;
    gap: 24px;
}

.nav-links ul li a {
    color: #FFFFFF;
    text-decoration: none;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.5px;
    transition: color 0.2s;
}

.nav-links ul li a:hover, .nav-links ul li a.router-link-active {
    color: var(--accent-gold);
}

.btn-donate {
    background-color: var(--accent-gold);
    color: white;
    padding: 12px 24px;
    border-radius: 6px;
    font-weight: 700;
    text-decoration: none;
    font-size: 14px;
    transition: all 0.3s;
    box-shadow: 0 4px 10px rgba(245, 166, 35, 0.3);
}

.btn-donate:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(245, 166, 35, 0.4);
    background-color: white;
    color: var(--accent-gold);
}
</style>
