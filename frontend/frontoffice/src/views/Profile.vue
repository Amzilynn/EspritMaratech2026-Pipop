<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { apiFetch } from '@/services/api'

const router = useRouter()

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
        const token = localStorage.getItem('access_token')
        if (!token) {
            router.push('/login')
            return
        }

        const response = await apiFetch('/auth/profile', {
            method: 'GET'
        })

        user.value = response
        editForm.value = {
            firstName: response.firstName,
            lastName: response.lastName,
            telephone: response.telephone || ''
        }
    } catch (err: any) {
        errorMsg.value = 'Erreur lors du chargement du profil'
        if (err.message.includes('401')) {
            localStorage.removeItem('access_token')
            router.push('/login')
        }
    }
}

function startEditing() {
    isEditing.value = true
    errorMsg.value = ''
    successMsg.value = ''
}

function cancelEditing() {
    isEditing.value = false
    editForm.value = {
        firstName: user.value.firstName,
        lastName: user.value.lastName,
        telephone: user.value.telephone || ''
    }
    errorMsg.value = ''
}

async function saveProfile() {
    errorMsg.value = ''
    successMsg.value = ''
    isLoading.value = true

    try {
        const response = await apiFetch('/users/profile', {
            method: 'PATCH',
            body: JSON.stringify(editForm.value)
        })

        user.value = { ...user.value, ...editForm.value }
        isEditing.value = false
        successMsg.value = 'Profil mis à jour avec succès !'
        
        setTimeout(() => successMsg.value = '', 3000)
    } catch (err: any) {
        errorMsg.value = err.message || 'Erreur lors de la mise à jour du profil'
    } finally {
        isLoading.value = false
    }
}

function logout() {
    localStorage.removeItem('access_token')
    router.push('/login')
}

function getRoleName(role: string) {
    const roles: Record<string, string> = {
        'ADMIN': 'Administrateur',
        'RESPONSABLE_TERRAIN': 'Responsable Terrain',
        'BENEVOLE': 'Bénévole',
        'CITOYEN': 'Citoyen'
    }
    return roles[role] || role
}

function getRoleColor(role: string) {
    const colors: Record<string, string> = {
        'ADMIN': '#D32F2F',
        'RESPONSABLE_TERRAIN': '#1976D2',
        'BENEVOLE': '#388E3C',
        'CITOYEN': '#F57C00'
    }
    return colors[role] || '#757575'
}
</script>

<template>
    <div class="profile-page">
        <div class="profile-container">
            <!-- Header -->
            <div class="profile-header">
                <div class="header-content">
                    <router-link to="/" class="back-link">
                        <i class="fa fa-arrow-left"></i> Retour à l'accueil
                    </router-link>
                    <h1>Mon Profil</h1>
                </div>
            </div>

            <div v-if="errorMsg" class="alert alert-error">
                <i class="fa fa-exclamation-circle"></i> {{ errorMsg }}
            </div>

            <div v-if="successMsg" class="alert alert-success">
                <i class="fa fa-check-circle"></i> {{ successMsg }}
            </div>

            <!-- Profile Card -->
            <div class="profile-card">
                <!-- Avatar Section -->
                <div class="avatar-section">
                    <div class="avatar">
                        <i class="fa fa-user"></i>
                    </div>
                    <div class="role-badge" :style="{ background: getRoleColor(user.role) }">
                        {{ getRoleName(user.role) }}
                    </div>
                </div>

                <!-- Info Section -->
                <div class="info-section">
                    <div v-if="!isEditing" class="info-display">
                        <div class="info-row">
                            <div class="info-item">
                                <label><i class="fa fa-user"></i> Prénom</label>
                                <p>{{ user.firstName }}</p>
                            </div>
                            <div class="info-item">
                                <label>Nom</label>
                                <p>{{ user.lastName }}</p>
                            </div>
                        </div>

                        <div class="info-row">
                            <div class="info-item full">
                                <label><i class="fa fa-envelope"></i> Email</label>
                                <p>{{ user.email }}</p>
                            </div>
                        </div>

                        <div class="info-row">
                            <div class="info-item full">
                                <label><i class="fa fa-phone"></i> Téléphone</label>
                                <p>{{ user.telephone || 'Non renseigné' }}</p>
                            </div>
                        </div>

                        <div class="action-buttons">
                            <button @click="startEditing" class="btn btn-primary">
                                <i class="fa fa-edit"></i> Modifier le Profil
                            </button>
                            <button @click="logout" class="btn btn-secondary">
                                <i class="fa fa-sign-out"></i> Se Déconnecter
                            </button>
                        </div>
                    </div>

                    <!-- Edit Form -->
                    <div v-else class="info-edit">
                        <form @submit.prevent="saveProfile">
                            <div class="form-row">
                                <div class="form-group">
                                    <label><i class="fa fa-user"></i> Prénom *</label>
                                    <input 
                                        v-model="editForm.firstName" 
                                        type="text" 
                                        required 
                                        placeholder="Votre prénom"
                                    />
                                </div>
                                <div class="form-group">
                                    <label>Nom *</label>
                                    <input 
                                        v-model="editForm.lastName" 
                                        type="text" 
                                        required 
                                        placeholder="Votre nom"
                                    />
                                </div>
                            </div>

                            <div class="form-group">
                                <label><i class="fa fa-phone"></i> Téléphone</label>
                                <input 
                                    v-model="editForm.telephone" 
                                    type="tel" 
                                    placeholder="+216 XX XXX XXX"
                                />
                            </div>

                            <div class="form-note">
                                <i class="fa fa-info-circle"></i>
                                L'adresse email ne peut pas être modifiée. Contactez l'administrateur si nécessaire.
                            </div>

                            <div class="action-buttons">
                                <button type="submit" class="btn btn-success" :disabled="isLoading">
                                    <span v-if="isLoading">
                                        <i class="fa fa-spinner fa-spin"></i> Enregistrement...
                                    </span>
                                    <span v-else>
                                        <i class="fa fa-check"></i> Enregistrer
                                    </span>
                                </button>
                                <button type="button" @click="cancelEditing" class="btn btn-cancel">
                                    <i class="fa fa-times"></i> Annuler
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <!-- Quick Links -->
            <div class="quick-links">
                <h3>Accès Rapide</h3>
                <div class="links-grid">
                    <router-link to="/ocr" class="link-card">
                        <i class="fa fa-file-text"></i>
                        <h4>Mes Ordonnances</h4>
                        <p>Scanner et gérer vos ordonnances</p>
                    </router-link>
                    <router-link to="/actions" class="link-card">
                        <i class="fa fa-heart"></i>
                        <h4>Nos Actions</h4>
                        <p>Découvrir nos actions humanitaires</p>
                    </router-link>
                    <router-link to="/contact" class="link-card">
                        <i class="fa fa-envelope"></i>
                        <h4>Contact</h4>
                        <p>Nous contacter pour plus d'infos</p>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.profile-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #1E5A8E 0%, #2B7EC1 50%, #5FA3D8 100%);
    padding: 40px 20px;
}

.profile-container {
    max-width: 900px;
    margin: 0 auto;
}

.profile-header {
    margin-bottom: 30px;
}

.header-content {
    color: white;
}

.back-link {
    color: white;
    text-decoration: none;
    font-size: 14px;
    opacity: 0.9;
    display: inline-block;
    margin-bottom: 10px;
    transition: opacity 0.3s;
}

.back-link:hover {
    opacity: 1;
}

.profile-header h1 {
    font-size: 36px;
    font-weight: 700;
    margin: 0;
}

.alert {
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.alert-error {
    background: #FFF5F5;
    color: #D32F2F;
    border: 1px solid #FFCDD2;
}

.alert-success {
    background: #F0FFF4;
    color: #2E7D32;
    border: 1px solid #C8E6C9;
}

.profile-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
    overflow: hidden;
    margin-bottom: 30px;
}

.avatar-section {
    background: linear-gradient(135deg, #2B7EC1, #1E5A8E);
    padding: 40px;
    text-align: center;
    color: white;
}

.avatar {
    width: 120px;
    height: 120px;
    background: white;
    border-radius: 50%;
    margin: 0 auto 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.avatar i {
    font-size: 60px;
    color: #2B7EC1;
}

.role-badge {
    display: inline-block;
    padding: 8px 20px;
    border-radius: 20px;
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
}

.info-section {
    padding: 40px;
}

.info-row {
    display: flex;
    gap: 20px;
    margin-bottom: 24px;
}

.info-item {
    flex: 1;
}

.info-item.full {
    flex: 1 1 100%;
}

.info-item label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #636E72;
    margin-bottom: 6px;
}

.info-item label i {
    color: #2B7EC1;
    margin-right: 6px;
}

.info-item p {
    font-size: 16px;
    color: #2D3436;
    margin: 0;
    padding: 10px 0;
}

.form-row {
    display: flex;
    gap: 16px;
}

.form-group {
    flex: 1;
    margin-bottom: 20px;
}

.form-group label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #2D3436;
    margin-bottom: 6px;
}

.form-group label i {
    color: #2B7EC1;
    margin-right: 6px;
}

.form-group input {
    width: 100%;
    padding: 12px 14px;
    border: 2px solid #E0E0E0;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s;
    box-sizing: border-box;
}

.form-group input:focus {
    outline: none;
    border-color: #2B7EC1;
}

.form-note {
    background: #E8F4FD;
    color: #1E5A8E;
    padding: 12px 14px;
    border-radius: 8px;
    font-size: 13px;
    margin-bottom: 20px;
}

.action-buttons {
    display: flex;
    gap: 12px;
    margin-top: 30px;
}

.btn {
    flex: 1;
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.btn-primary {
    background: linear-gradient(135deg, #2B7EC1, #1E5A8E);
    color: white;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(43, 126, 193, 0.4);
}

.btn-secondary {
    background: #636E72;
    color: white;
}

.btn-secondary:hover {
    background: #4A5458;
    transform: translateY(-2px);
}

.btn-success {
    background: #4CAF50;
    color: white;
}

.btn-success:hover:not(:disabled) {
    background: #45A049;
    transform: translateY(-2px);
}

.btn-success:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.btn-cancel {
    background: #E0E0E0;
    color: #2D3436;
}

.btn-cancel:hover {
    background: #BDBDBD;
}

.quick-links {
    background: white;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.quick-links h3 {
    font-size: 20px;
    color: #2D3436;
    margin-bottom: 20px;
}

.links-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
}

.link-card {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 24px;
    border-radius: 12px;
    text-decoration: none;
    text-align: center;
    transition: all 0.3s;
    border: 2px solid transparent;
}

.link-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    border-color: #2B7EC1;
}

.link-card i {
    font-size: 36px;
    color: #2B7EC1;
    margin-bottom: 12px;
}

.link-card h4 {
    font-size: 16px;
    color: #2D3436;
    margin-bottom: 6px;
}

.link-card p {
    font-size: 13px;
    color: #636E72;
    margin: 0;
}

@media (max-width: 768px) {
    .info-row {
        flex-direction: column;
    }
    
    .action-buttons {
        flex-direction: column;
    }
    
    .form-row {
        flex-direction: column;
    }
}
</style>
