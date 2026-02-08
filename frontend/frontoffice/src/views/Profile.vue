<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch } from '@/services/api'
import FaceCaptureModal from '@/components/FaceCaptureModal.vue'
import { useVoiceAssistant } from '@/composables/useVoiceAssistant'

const router = useRouter()
const { ttsEnabled, currentlySpeaking, speak, stopSpeaking } = useVoiceAssistant()

const user = ref({
    firstName: '',
    lastName: '',
    email: '',
    telephone: '',
    role: ''
})

const isEditing = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const isFaceModalOpen = ref(false)

const editForm = ref({
    firstName: '',
    lastName: '',
    telephone: ''
})

onMounted(async () => {
    await loadProfile()
})

async function loadProfile() {
    try {
        const response = await apiFetch('/users/profile')
        user.value = response
        editForm.value = {
            firstName: response.firstName,
            lastName: response.lastName,
            telephone: response.telephone || ''
        }
    } catch (err: any) {
        if (err.message.includes('401')) {
            localStorage.removeItem('access_token')
            router.push('/login')
        }
    }
}

async function saveProfile() {
    isLoading.value = true
    try {
        await apiFetch('/users/profile', {
            method: 'PATCH',
            body: JSON.stringify(editForm.value)
        })
        user.value = { ...user.value, ...editForm.value }
        isEditing.value = false
        successMsg.value = 'Profil mis à jour !'
        setTimeout(() => successMsg.value = '', 3000)
    } catch (err: any) {
        errorMsg.value = err.message
    } finally {
        isLoading.value = false
    }
}

async function handleFaceEnroll(file: File) {
    isFaceModalOpen.value = false
    isLoading.value = true
    try {
        const formData = new FormData()
        formData.append('file', file)
        const token = localStorage.getItem('access_token')
        await fetch('http://localhost:3000/auth/face-enroll', {
            method: 'POST',
            body: formData,
            headers: { 'Authorization': `Bearer ${token}` }
        })
        successMsg.value = "Face ID configuré !"
    } catch (e: any) {
        errorMsg.value = e.message
    } finally {
        isLoading.value = false
    }
}

function logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('fo_user')
    router.push('/login')
}

// Voice Handlers
const onHoverBreadcam = () => speak("Mon Profil personnel.", 'bradcam')
const onHoverInfo = (label: string, value: string) => speak(`${label} : ${value || 'Non renseigné'}.`, 'info-' + label)
const onHoverQuickLink = (name: string) => speak(`Accès rapide vers ${name}.`, 'link-' + name)
</script>

<template>
    <div class="profile-page">
        <!-- Page Header -->
        <div class="page-header-omnia" @mouseenter="onHoverBreadcam" @mouseleave="stopSpeaking">
            <div class="container-omnia">
                <h1>ESPACE MEMBRE</h1>
                <p>Gérez vos informations personnelles et accédez à vos services.</p>
            </div>
        </div>

        <section class="section-padding container-omnia">
            <div class="profile-layout">
                <!-- Sidebar / Bio -->
                <aside class="profile-sidebar">
                    <div class="card-omnia bio-card text-center">
                        <div class="avatar-circle">
                            <i class="fa fa-user"></i>
                        </div>
                        <h2>{{ user.firstName }} {{ user.lastName }}</h2>
                        <div class="role-pill" :class="user.role.toLowerCase()">{{ user.role }}</div>
                        
                        <div class="mt-4 pt-4 border-top">
                            <button class="btn-omnia btn-outline w-100 mb-2" @click="isEditing = !isEditing">
                                <i class="fa" :class="isEditing ? 'fa-times' : 'fa-edit'"></i>
                                {{ isEditing ? 'ANNULER' : 'MODIFIER PROFIL' }}
                            </button>
                            <button class="btn-omnia btn-accent w-100 mb-2" @click="isFaceModalOpen = true">
                                <i class="fa fa-camera"></i> FACE ID
                            </button>
                            <button class="btn-omnia btn-error w-100" @click="logout">
                                <i class="fa fa-sign-out"></i> DÉCONNEXION
                            </button>
                        </div>
                    </div>
                </aside>

                <!-- Profile Content -->
                <div class="profile-main">
                    <div v-if="successMsg" class="alert-omnia success mb-4">{{ successMsg }}</div>
                    <div v-if="errorMsg" class="alert-omnia error mb-4">{{ errorMsg }}</div>

                    <!-- Info Display -->
                    <div v-if="!isEditing" class="card-omnia profile-details">
                        <div class="details-grid">
                            <div class="detail-item" @mouseenter="onHoverInfo('Prénom', user.firstName)" @mouseleave="stopSpeaking">
                                <label>PRÉNOM</label>
                                <p>{{ user.firstName }}</p>
                            </div>
                            <div class="detail-item" @mouseenter="onHoverInfo('Nom', user.lastName)" @mouseleave="stopSpeaking">
                                <label>NOM</label>
                                <p>{{ user.lastName }}</p>
                            </div>
                            <div class="detail-item full" @mouseenter="onHoverInfo('Email', user.email)" @mouseleave="stopSpeaking">
                                <label>ADRESSE EMAIL</label>
                                <p>{{ user.email }}</p>
                            </div>
                            <div class="detail-item full" @mouseenter="onHoverInfo('Téléphone', user.telephone)" @mouseleave="stopSpeaking">
                                <label>TÉLÉPHONE</label>
                                <p>{{ user.telephone || 'Non renseigné' }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Edit Form -->
                    <div v-else class="card-omnia profile-edit">
                        <form @submit.prevent="saveProfile">
                            <div class="row">
                                <div class="col-md-6 mb-3">
                                    <div class="form-group-omnia">
                                        <label>PRÉNOM</label>
                                        <input v-model="editForm.firstName" type="text" class="form-control-omnia">
                                    </div>
                                </div>
                                <div class="col-md-6 mb-3">
                                    <div class="form-group-omnia">
                                        <label>NOM</label>
                                        <input v-model="editForm.lastName" type="text" class="form-control-omnia">
                                    </div>
                                </div>
                            </div>
                            <div class="form-group-omnia mb-4">
                                <label>TÉLÉPHONE</label>
                                <input v-model="editForm.telephone" type="tel" class="form-control-omnia">
                            </div>
                            <button type="submit" class="btn-omnia btn-primary" :disabled="isLoading">
                                <span v-if="isLoading">CHARGEMENT...</span>
                                <span v-else>SAUVEGARDER LES CHANGEMENTS</span>
                            </button>
                        </form>
                    </div>

                    <!-- Quick Actions -->
                    <div class="quick-actions mt-5">
                        <h3 class="mb-3">ACCÈS RAPIDES</h3>
                        <div class="actions-grid">
                            <router-link to="/ocr" class="action-card card-omnia" @mouseenter="onHoverQuickLink('Mes Ordonnances')" @mouseleave="stopSpeaking">
                                <i class="fa fa-file-text"></i>
                                <span>MES ORDONNANCES</span>
                            </router-link>
                            <router-link to="/donate" class="action-card card-omnia" @mouseenter="onHoverQuickLink('Faire un don')" @mouseleave="stopSpeaking">
                                <i class="fa fa-heart"></i>
                                <span>FAIRE UN DON</span>
                            </router-link>
                            <router-link to="/contact" class="action-card card-omnia" @mouseenter="onHoverQuickLink('Aide')" @mouseleave="stopSpeaking">
                                <i class="fa fa-question-circle"></i>
                                <span>BESOIN D'AIDE ?</span>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <FaceCaptureModal 
            v-if="isFaceModalOpen" 
            @captured="handleFaceEnroll" 
            @close="isFaceModalOpen = false" 
        />
    </div>
</template>

<style scoped>
.profile-layout {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: var(--spacing-xxl);
}

.avatar-circle {
    width: 100px;
    height: 100px;
    background: var(--light-blue);
    color: var(--primary-blue);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
    margin: 0 auto var(--spacing-md);
    border: 3px solid var(--primary-blue);
}

.bio-card h2 {
    font-size: 20px;
    margin-bottom: var(--spacing-xs);
    color: var(--dark-blue);
}

.role-pill {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
}

.role-pill.citoyen { background: var(--light-blue); color: var(--primary-blue); }
.role-pill.admin { background: #fee2e2; color: #991b1b; }

.details-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-lg);
}

.detail-item.full { grid-column: span 2; }

.detail-item label {
    font-size: 12px;
    font-weight: 800;
    color: var(--text-muted);
    display: block;
    margin-bottom: 4px;
}

.detail-item p {
    font-size: 16px;
    font-weight: 600;
    color: var(--dark-blue);
    padding: var(--spacing-sm);
    background: #f8f9fa;
    border-radius: var(--radius-sm);
}

.actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--spacing-md);
}

.action-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: var(--spacing-lg);
    text-decoration: none;
    transition: all 0.2s;
}

.action-card:hover {
    background: var(--primary-blue);
    color: white !important;
    transform: translateY(-5px);
}

.action-card i {
    font-size: 24px;
    margin-bottom: 10px;
}

.action-card span {
    font-size: 12px;
    font-weight: 700;
}

.btn-error {
    background: var(--error-red);
    color: white;
}

.alert-omnia {
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
}
.alert-omnia.success { background: #dcfce7; color: #166534; }
.alert-omnia.error { background: #fee2e2; color: #991b1b; }

@media (max-width: 992px) {
    .profile-layout { grid-template-columns: 1fr; }
}
</style>
