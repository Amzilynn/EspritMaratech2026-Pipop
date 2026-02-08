<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch } from '@/services/api'
import FaceCaptureModal from '@/components/FaceCaptureModal.vue'
import { useVoiceAssistant } from '@/composables/useVoiceAssistant'

const router = useRouter()
const { ttsEnabled, currentlySpeaking, speak, stopSpeaking, toggleTts } = useVoiceAssistant()

const email = ref('')
const password = ref('')
const errorMsg = ref('')
const isLoading = ref(false)
const isFaceModalOpen = ref(false)

// Voice Handlers
const onHoverTitle = () => speak('Page de connexion Omnia. Connectez-vous pour accéder à votre espace.', 'title')
const onHoverEmail = () => speak(`Champ Adresse Email.`, 'email')
const onHoverPassword = () => speak(`Champ Mot de Passe.`, 'password')
const onHoverFaceBtn = () => speak('Utiliser la reconnaissance faciale pour se connecter.', 'face-btn')
const onHoverSubmit = () => speak('Bouton Se Connecter.', 'submit')
const onHoverTts = () => speak(`Lecture vocale : ${ttsEnabled.value ? 'activée' : 'désactivée'}. Cliquez pour changer.`, 'tts-toggle')

async function handleLogin() {
    errorMsg.value = ''
    if (!email.value || !password.value) {
        errorMsg.value = 'Veuillez remplir tous les champs.'
        return
    }
    isLoading.value = true
    try {
        const response = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email: email.value, password: password.value })
        });
        processLoginSuccess(response)
    } catch (err: any) {
        isLoading.value = false
        errorMsg.value = err.message || 'Identifiants invalides.'
    }
}

async function handleFaceLogin(file: File) {
    isFaceModalOpen.value = false
    isLoading.value = true
    try {
        const formData = new FormData()
        formData.append('file', file)
        const response = await fetch('http://localhost:3000/auth/face-login', {
            method: 'POST',
            body: formData
        })
        if (!response.ok) throw new Error('Visage non reconnu')
        const data = await response.json()
        processLoginSuccess(data)
    } catch (err: any) {
        isLoading.value = false
        errorMsg.value = err.message || 'Échec de la reconnaissance faciale.'
    }
}

function processLoginSuccess(data: any) {
    localStorage.setItem('fo_user', JSON.stringify(data.user))
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('user_email', data.user.email)
    localStorage.setItem('role', data.user.role.toLowerCase())

    const backendRole = data.user.role.toLowerCase();
    const backofficeRoles = ['admin', 'responsable_terrain', 'benevole', 'responsable']

    if (backofficeRoles.includes(backendRole)) {
        window.location.href = 'http://localhost:5173/spike-vue-free/'
    } else {
        router.push('/')
    }
}
</script>

<template>
    <div class="auth-splash">
        <div class="auth-card-wrapper">
            <div class="card-omnia auth-card shadow-lg">
                <div class="auth-header text-center" @mouseenter="onHoverTitle" @mouseleave="stopSpeaking">
                    <router-link to="/" class="auth-logo">Omnia</router-link>
                    <h1>CONNEXION</h1>
                    <p>Accédez à votre espace membre <i v-if="ttsEnabled && currentlySpeaking === 'title'" class="fa fa-assistive-listening-systems tts-pulse-icon"></i></p>
                </div>

                <div class="tts-pill-container">
                    <button class="tts-toggle-pill" :class="{ 'active': ttsEnabled }" @click="toggleTts" @mouseenter="onHoverTts" @mouseleave="stopSpeaking">
                        <i class="fa" :class="ttsEnabled ? 'fa-volume-up' : 'fa-volume-off'"></i>
                        <span>{{ ttsEnabled ? 'VOIX ON' : 'VOIX OFF' }}</span>
                    </button>
                </div>

                <div v-if="errorMsg" class="alert alert-danger" role="alert">
                    <i class="fa fa-exclamation-triangle"></i> {{ errorMsg }}
                </div>

                <form @submit.prevent="handleLogin" class="mt-4">
                    <div class="form-group-omnia" :class="{ 'tts-highlight': currentlySpeaking === 'email' }">
                        <label for="email" @mouseenter="onHoverEmail" @mouseleave="stopSpeaking">ADRESSE EMAIL</label>
                        <input 
                            type="email" 
                            id="email" 
                            v-model="email" 
                            class="form-control-omnia" 
                            placeholder="exemple@mail.com"
                            required
                        >
                    </div>

                    <div class="form-group-omnia" :class="{ 'tts-highlight': currentlySpeaking === 'password' }">
                        <label for="password" @mouseenter="onHoverPassword" @mouseleave="stopSpeaking">MOT DE PASSE</label>
                        <input 
                            type="password" 
                            id="password" 
                            v-model="password" 
                            class="form-control-omnia" 
                            placeholder="••••••••"
                            required
                        >
                    </div>

                    <div class="d-flex justify-content-between align-items-center mb-4">
                        <label class="checkbox-container">
                            <input type="checkbox"> 
                            <span class="checkmark"></span>
                            Se souvenir de moi
                        </label>
                        <a href="#" class="forgot-link">Mot de passe oublié ?</a>
                    </div>

                    <button type="submit" class="btn-omnia btn-primary w-100 mb-3" :disabled="isLoading" @mouseenter="onHoverSubmit" @mouseleave="stopSpeaking">
                        <span v-if="isLoading"><i class="fa fa-spinner fa-spin"></i> CONNEXION...</span>
                        <span v-else>SE CONNECTER</span>
                    </button>

                    <div class="auth-divider">
                        <span>OU</span>
                    </div>

                    <button type="button" class="btn-omnia btn-outline w-100" @click="isFaceModalOpen = true" @mouseenter="onHoverFaceBtn" @mouseleave="stopSpeaking">
                        <i class="fa fa-camera"></i> FACE ID
                    </button>
                </form>

                <div class="auth-footer text-center mt-5">
                    <p>Pas encore membre ? <router-link to="/register" class="text-primary font-weight-bold">Créer un compte</router-link></p>
                </div>
            </div>
            
            <div class="text-center mt-4">
                <router-link to="/" class="text-white opacity-70"><i class="fa fa-arrow-left"></i> Retour à l'accueil</router-link>
            </div>
        </div>

        <FaceCaptureModal 
            v-if="isFaceModalOpen" 
            @captured="handleFaceLogin" 
            @close="isFaceModalOpen = false" 
        />
    </div>
</template>

<style scoped>
.auth-splash {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--secondary-blue) 0%, var(--primary-blue) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-lg);
}

.auth-card-wrapper {
    width: 100%;
    max-width: 480px;
}

.auth-card {
    padding: var(--spacing-xxl) var(--spacing-xl);
}

.auth-logo {
    font-size: 32px;
    font-weight: 800;
    color: var(--primary-blue);
    text-decoration: none;
    display: block;
    margin-bottom: var(--spacing-md);
}

.auth-header h1 {
    font-size: 24px;
    letter-spacing: 2px;
    margin-bottom: var(--spacing-xs);
}

.auth-header p {
    color: var(--text-dark);
    font-weight: 500;
    font-size: 1.1rem;
}

.tts-pill-container {
    display: flex;
    justify-content: center;
    margin-top: var(--spacing-md);
}

.tts-toggle-pill {
    background: var(--light-blue);
    color: var(--primary-blue);
    border: 1px solid var(--primary-blue);
}

.tts-toggle-pill.active {
    background: var(--success-green);
    border-color: var(--success-green);
    color: white;
}

.auth-divider {
    text-align: center;
    margin: var(--spacing-lg) 0;
    position: relative;
}

.auth-divider::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    width: 100%;
    height: 1px;
    background: var(--border-color);
}

.auth-divider span {
    background: white;
    padding: 0 15px;
    position: relative;
    color: var(--text-muted);
    font-size: 12px;
    font-weight: 700;
}

.checkbox-container {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-size: 14px;
    color: var(--text-muted);
}

.forgot-link {
    font-size: 14px;
    color: var(--primary-blue);
    text-decoration: none;
    font-weight: 600;
}

.alert-danger {
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    background-color: #fce4e4;
    border: 1px solid #f9cccc;
    color: #cc0000;
    font-size: 14px;
    margin-top: var(--spacing-lg);
}

.opacity-70 { opacity: 0.9; transition: opacity 0.2s; font-weight: 600; }
.opacity-70:hover { opacity: 1; text-decoration: underline; }
.text-primary { color: var(--primary-blue) !important; }
.font-weight-bold { font-weight: 700; }
</style>
