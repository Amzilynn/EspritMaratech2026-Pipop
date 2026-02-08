<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch } from '@/services/api'
import FaceCaptureModal from '@/components/FaceCaptureModal.vue'
import { useVoiceAssistant } from '@/composables/useVoiceAssistant'

const router = useRouter()
const { ttsEnabled, currentlySpeaking, speak, stopSpeaking, toggleTts } = useVoiceAssistant()

const form = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
})

const errorMsg = ref('')
const successMsg = ref('')
const isLoading = ref(false)
const isFaceModalOpen = ref(false)
const faceFile = ref<File | null>(null)

function handleFaceCaptured(file: File) {
    faceFile.value = file
    isFaceModalOpen.value = false
}

// Voice Handlers
const onHoverTitle = () => speak('Rejoignez Omnia. Créez votre compte pour participer à nos actions.', 'title')
const onHoverFirstName = () => speak(`Champ Prénom.`, 'firstName')
const onHoverLastName = () => speak(`Champ Nom.`, 'lastName')
const onHoverEmail = () => speak(`Champ Adresse Email.`, 'email')
const onHoverPhone = () => speak(`Champ Téléphone.`, 'phone')
const onHoverPassword = () => speak(`Champ Mot de Passe.`, 'password')
const onHoverConfirm = () => speak(`Confirmer le mot de passe.`, 'confirm')
const onHoverFaceSetup = () => speak(faceFile.value ? 'Visage capturé.' : 'Configurer Face ID pour une connexion simplifiée.', 'face-setup')
const onHoverSubmit = () => speak('Bouton Créer mon Compte.', 'submit')

async function handleRegister() {
    errorMsg.value = ''
    successMsg.value = ''

    if (!form.value.firstName || !form.value.lastName || !form.value.email || !form.value.password) {
        errorMsg.value = 'Veuillez remplir tous les champs obligatoires.'
        return
    }

    if (form.value.password !== form.value.confirmPassword) {
        errorMsg.value = 'Les mots de passe ne correspondent pas.'
        return
    }

    isLoading.value = true

    try {
        await apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email: form.value.email,
                password: form.value.password,
                lastName: form.value.lastName,
                firstName: form.value.firstName,
                telephone: form.value.phone,
                roleName: 'CITOYEN'
            })
        });

        if (faceFile.value) {
            try {
                const loginRes = await apiFetch('/auth/login', {
                    method: 'POST',
                    body: JSON.stringify({ email: form.value.email, password: form.value.password })
                });
                const token = loginRes.access_token;

                const formData = new FormData()
                formData.append('file', faceFile.value)
                
                await fetch('http://localhost:3000/auth/face-enroll', {
                    method: 'POST',
                    body: formData,
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                successMsg.value = 'Compte créé avec Face ID !'
            } catch (e) {
                successMsg.value = 'Compte créé (erreur Face ID)'
            }
        } else {
            successMsg.value = 'Compte créé avec succès !'
        }

        setTimeout(() => router.push('/login'), 2000)
    } catch (err: any) {
        isLoading.value = false
        errorMsg.value = err.message || 'Erreur lors de l\'inscription.'
    }
}
</script>

<template>
    <div class="auth-splash">
        <div class="auth-card-wrapper wide">
            <div class="card-omnia auth-card shadow-lg">
                <div class="auth-header text-center" @mouseenter="onHoverTitle" @mouseleave="stopSpeaking">
                    <router-link to="/" class="auth-logo">Omnia</router-link>
                    <h1>INSCRIPTION</h1>
                    <p>Devenez acteur du changement avec nous <i v-if="ttsEnabled && currentlySpeaking === 'title'" class="fa fa-assistive-listening-systems tts-pulse-icon"></i></p>
                </div>

                <div class="tts-pill-container">
                    <button class="tts-toggle-pill" :class="{ 'active': ttsEnabled }" @click="toggleTts">
                        <i class="fa" :class="ttsEnabled ? 'fa-volume-up' : 'fa-volume-off'"></i>
                        <span>{{ ttsEnabled ? 'VOIX ON' : 'VOIX OFF' }}</span>
                    </button>
                </div>

                <div v-if="errorMsg" class="alert alert-danger" role="alert">
                    <i class="fa fa-exclamation-triangle"></i> {{ errorMsg }}
                </div>
                <div v-if="successMsg" class="alert alert-success" role="alert">
                    <i class="fa fa-check-circle"></i> {{ successMsg }}
                </div>

                <form @submit.prevent="handleRegister" class="mt-4">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group-omnia" :class="{ 'tts-highlight': currentlySpeaking === 'firstName' }">
                                <label @mouseenter="onHoverFirstName" @mouseleave="stopSpeaking">PRÉNOM *</label>
                                <input v-model="form.firstName" type="text" class="form-control-omnia" placeholder="Jean" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group-omnia" :class="{ 'tts-highlight': currentlySpeaking === 'lastName' }">
                                <label @mouseenter="onHoverLastName" @mouseleave="stopSpeaking">NOM *</label>
                                <input v-model="form.lastName" type="text" class="form-control-omnia" placeholder="Dupont" required>
                            </div>
                        </div>
                    </div>

                    <div class="form-group-omnia" :class="{ 'tts-highlight': currentlySpeaking === 'email' }">
                        <label @mouseenter="onHoverEmail" @mouseleave="stopSpeaking">ADRESSE EMAIL *</label>
                        <input v-model="form.email" type="email" class="form-control-omnia" placeholder="jean@mail.com" required>
                    </div>

                    <div class="form-group-omnia" :class="{ 'tts-highlight': currentlySpeaking === 'phone' }">
                        <label @mouseenter="onHoverPhone" @mouseleave="stopSpeaking">TÉLÉPHONE</label>
                        <input v-model="form.phone" type="tel" class="form-control-omnia" placeholder="+216 ...">
                    </div>

                    <div class="row">
                        <div class="col-md-6">
                            <div class="form-group-omnia" :class="{ 'tts-highlight': currentlySpeaking === 'password' }">
                                <label @mouseenter="onHoverPassword" @mouseleave="stopSpeaking">MOT DE PASSE *</label>
                                <input v-model="form.password" type="password" class="form-control-omnia" placeholder="••••••••" required>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="form-group-omnia" :class="{ 'tts-highlight': currentlySpeaking === 'confirm' }">
                                <label @mouseenter="onHoverConfirm" @mouseleave="stopSpeaking">CONFIRMATION *</label>
                                <input v-model="form.confirmPassword" type="password" class="form-control-omnia" placeholder="••••••••" required>
                            </div>
                        </div>
                    </div>

                    <div class="face-setup-section mb-4" :class="{ 'tts-highlight': currentlySpeaking === 'face-setup' }">
                        <label class="d-block mb-2" @mouseenter="onHoverFaceSetup" @mouseleave="stopSpeaking">RECONNAISSANCE FACIALE (OPTIONNEL)</label>
                        <div v-if="!faceFile" class="face-setup-placeholder" @click="isFaceModalOpen = true">
                            <i class="fa fa-camera"></i>
                            <span>Cliquer pour configurer Face ID</span>
                        </div>
                        <div v-else class="face-setup-success">
                            <i class="fa fa-check-circle"></i> Visage enregistré ! 
                            <button type="button" @click="faceFile = null" class="btn-link">Supprimer</button>
                        </div>
                    </div>

                    <p class="terms-text">
                        En m'inscrivant, j'accepte les <a href="#">conditions d'utilisation</a> d'Omnia.
                    </p>

                    <button type="submit" class="btn-omnia btn-primary w-100 mb-3" :disabled="isLoading" @mouseenter="onHoverSubmit" @mouseleave="stopSpeaking">
                        <span v-if="isLoading"><i class="fa fa-spinner fa-spin"></i> CRÉATION...</span>
                        <span v-else>CRÉER MON COMPTE</span>
                    </button>
                </form>

                <div class="auth-footer text-center mt-4">
                    <p>Déjà membre ? <router-link to="/login" class="text-primary font-weight-bold">Se connecter</router-link></p>
                </div>
            </div>
            
            <div class="text-center mt-4">
                <router-link to="/" class="text-white opacity-70"><i class="fa fa-arrow-left"></i> Retour à l'accueil</router-link>
            </div>
        </div>

        <FaceCaptureModal 
            v-if="isFaceModalOpen" 
            @captured="handleFaceCaptured" 
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
    max-width: 600px;
}

.auth-card {
    padding: var(--spacing-xl);
}

.auth-logo {
    font-size: 32px;
    font-weight: 800;
    color: var(--primary-blue);
    text-decoration: none;
    display: block;
    margin-bottom: var(--spacing-md);
}

.auth-header p {
    color: var(--text-dark);
    font-weight: 500;
    font-size: 1.1rem;
}

.tts-pill-container {
    display: flex;
    justify-content: center;
    margin-bottom: var(--spacing-lg);
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

.face-setup-placeholder {
    border: 2px dashed var(--border-color);
    padding: var(--spacing-lg);
    border-radius: var(--radius-md);
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s;
    color: var(--text-muted);
}

.face-setup-placeholder:hover {
    border-color: var(--primary-blue);
    color: var(--primary-blue);
    background: var(--light-blue);
}

.face-setup-placeholder i {
    font-size: 24px;
    margin-bottom: 8px;
}

.face-setup-success {
    background: var(--light-blue);
    border: 1px solid var(--primary-blue);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    color: var(--secondary-blue);
    font-weight: 600;
}

.terms-text {
    font-size: 13px;
    color: var(--text-muted);
    text-align: center;
    margin-bottom: var(--spacing-lg);
}

.alert {
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    margin-top: var(--spacing-md);
    font-size: 14px;
}

.alert-success { background: #e8f5e9; color: #2e7d32; border: 1px solid #c8e6c9; }
.alert-danger { background: #ffebee; color: #c62828; border: 1px solid #ffcdd2; }

.opacity-70 { opacity: 0.9; transition: opacity 0.2s; font-weight: 600; }
.opacity-70:hover { opacity: 1; text-decoration: underline; }
.text-primary { color: var(--primary-blue) !important; }
.font-weight-bold { font-weight: 700; }
.btn-link { background: none; border: none; color: var(--error-red); text-decoration: underline; cursor: pointer; margin-left: 10px; }
</style>
