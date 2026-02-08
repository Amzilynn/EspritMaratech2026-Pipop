<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiFetch } from '@/services/api'

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string>('')
const extractedText = ref<string>('')
const isLoading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const notes = ref('')

// History of prescriptions
const myPrescriptions = ref<any[]>([])

onMounted(async () => {
    await loadMyPrescriptions()
})

async function loadMyPrescriptions() {
    try {
        const response = await apiFetch('/prescriptions/my-prescriptions')
        myPrescriptions.value = response
    } catch (e) {
        console.error('Failed to load prescriptions', e)
    }
}

function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    
    if (file) {
        if (!file.type.startsWith('image/')) {
            errorMsg.value = 'Veuillez sélectionner une image valide (photo de votre ordonnance)'
            return
        }
        
        selectedFile.value = file
        previewUrl.value = URL.createObjectURL(file)
        extractedText.value = ''
        errorMsg.value = ''
        successMsg.value = ''
    }
}

async function scanAndSave() {
    if (!selectedFile.value) {
        errorMsg.value = 'Veuillez d\'abord prendre une photo de votre ordonnance'
        return
    }
    
    isLoading.value = true
    errorMsg.value = ''
    successMsg.value = ''
    
    try {
        const formData = new FormData()
        formData.append('file', selectedFile.value)
        formData.append('notes', notes.value || 'Ordonnance numérisée')
        
        const token = localStorage.getItem('access_token')
        
        const response = await fetch('http://localhost:3000/prescriptions/scan', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}))
            throw new Error(errorData.message || 'Erreur lors du traitement de l\'ordonnance')
        }
        
        const data = await response.json()
        extractedText.value = data.extractedText
        successMsg.value = 'Ordonnance analysée et sauvegardée avec succès !'
        
        // Reload history
        await loadMyPrescriptions()
        
    } catch (err: any) {
        console.error('Scan Error:', err)
        errorMsg.value = err.message || 'Une erreur est survenue lors de l\'envoi'
    } finally {
        isLoading.value = false
    }
}

function clearImage() {
    selectedFile.value = null
    previewUrl.value = ''
    extractedText.value = ''
    errorMsg.value = ''
    successMsg.value = ''
    notes.value = ''
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}
</script>

<template>
    <div class="prescription-page">
        <div class="container">
            <!-- Header with Back Link -->
            <div class="header-section text-center">
                 <router-link to="/profile" class="back-link">
                    <i class="fa fa-arrow-left"></i> Retour au Profil
                </router-link>
                <h1>💊 Mon Scanner d'Ordonnances</h1>
                <p>Numérisez vos ordonnances médicales pour les conserver en sécurité</p>
            </div>

            <div class="row">
                <!-- Scanner Section -->
                <div class="col-lg-7 mb-4">
                    <div class="card scanner-card">
                        <div class="card-header">
                            <h3><i class="fa fa-camera"></i> Nouvelle Analyse</h3>
                        </div>
                        <div class="card-body">
                            <div v-if="errorMsg" class="alert alert-danger">
                                <i class="fa fa-exclamation-triangle"></i> {{ errorMsg }}
                            </div>

                            <div v-if="successMsg" class="alert alert-success">
                                <i class="fa fa-check-circle"></i> {{ successMsg }}
                            </div>

                            <div v-if="!previewUrl" class="upload-zone">
                                <input 
                                    type="file" 
                                    id="prescriptionFile" 
                                    accept="image/*" 
                                    @change="handleFileSelect"
                                    class="file-input"
                                />
                                <label for="prescriptionFile" class="upload-label">
                                    <div class="icon-circle">
                                        <i class="fa fa-camera"></i>
                                    </div>
                                    <h4>Prendre une photo</h4>
                                    <p>ou choisir depuis la galerie</p>
                                </label>
                            </div>

                            <div v-else class="preview-zone">
                                <div class="image-container">
                                    <img :src="previewUrl" alt="Ordonnance" />
                                    <button @click="clearImage" class="btn-remove" title="Supprimer">
                                        <i class="fa fa-times"></i>
                                    </button>
                                </div>
                                
                                <div class="form-group mt-3">
                                    <label>Ajouter une note (optionnel)</label>
                                    <input 
                                        type="text"
                                        v-model="notes" 
                                        class="form-control" 
                                        placeholder="Ex: Grippe Hiver 2024"
                                    />
                                </div>

                                <div class="actions mt-3">
                                    <button 
                                        @click="scanAndSave" 
                                        class="btn btn-primary btn-lg w-100"
                                        :disabled="isLoading"
                                    >
                                        <span v-if="isLoading">
                                            <i class="fa fa-spinner fa-spin"></i> Analyse en cours...
                                            <small class="d-block" style="font-size: 0.8rem; font-weight: normal;">(Cela peut prendre quelques secondes)</small>
                                        </span>
                                        <span v-else>
                                            <i class="fa fa-magic"></i> Analyser et Enregistrer
                                        </span>
                                    </button>
                                </div>
                                
                                <div v-if="extractedText" class="result-box mt-4">
                                    <h5><i class="fa fa-file-text-o"></i> Contenu détecté :</h5>
                                    <div class="textarea-container">
                                        <textarea class="form-control result-text" rows="6" readonly>{{ extractedText }}</textarea>
                                    </div>
                                    <p class="text-muted mt-2"><small>Ce texte a été extrait automatiquement par notre IA.</small></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- History Section -->
                <div class="col-lg-5">
                    <div class="card history-card">
                        <div class="card-header">
                            <h3><i class="fa fa-history"></i> Mes Ordonnances</h3>
                        </div>
                        <div class="card-body p-0">
                            <div v-if="myPrescriptions.length === 0" class="empty-state">
                                <i class="fa fa-folder-open-o"></i>
                                <p>Aucune ordonnance enregistrée</p>
                            </div>
                            <div v-else class="prescription-list">
                                <div v-for="p in myPrescriptions" :key="p.id" class="prescription-item">
                                    <div class="d-flex justify-content-between align-items-start">
                                        <div>
                                            <h5 class="mb-1">{{ p.notes || 'Ordonnance sans titre' }}</h5>
                                            <small class="text-muted">
                                                <i class="fa fa-calendar"></i> {{ formatDate(p.createdAt) }}
                                            </small>
                                        </div>
                                        <div class="icon-file">
                                            <i class="fa fa-file-text-o"></i>
                                        </div>
                                    </div>
                                    <div class="item-preview mt-2">
                                        {{ p.extractedText ? p.extractedText.substring(0, 80) + '...' : 'Aucun texte extrait' }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.prescription-page {
    /* Updated to match Profile.vue blue gradient */
    background: linear-gradient(135deg, #1E5A8E 0%, #2B7EC1 50%, #5FA3D8 100%);
    min-height: 100vh;
    padding: 40px 0;
}

.header-section {
    margin-bottom: 40px;
    color: white;
}

.header-section h1 {
    color: white;
    font-weight: 700;
    margin-bottom: 10px;
}

.header-section p {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
}

.back-link {
    color: rgba(255, 255, 255, 0.8);
    text-decoration: none;
    display: inline-block;
    margin-bottom: 15px;
    transition: color 0.3s;
}

.back-link:hover {
    color: white;
}

.card {
    border: none;
    border-radius: 16px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
    background: white;
    overflow: hidden;
    height: 100%;
}

.card-header {
    background: white;
    border-bottom: 1px solid #eee;
    padding: 20px 25px;
}

.card-header h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: #2c3e50;
}

.card-body {
    padding: 25px;
}

/* Scanner Styles */
.upload-zone {
    border: 2px dashed #cbd5e0;
    border-radius: 12px;
    background: #f8fafc;
    transition: all 0.3s ease;
    text-align: center;
    padding: 40px 20px;
    cursor: pointer;
}

.upload-zone:hover {
    border-color: #2B7EC1;
    background: #ebf8ff;
}

.file-input {
    display: none;
}

.upload-label {
    cursor: pointer;
    display: block;
    width: 100%;
}

.icon-circle {
    width: 80px;
    height: 80px;
    background: #e2e8f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 15px;
    color: #718096;
    font-size: 32px;
    transition: all 0.3s;
}

.upload-zone:hover .icon-circle {
    background: #2B7EC1;
    color: white;
}

.image-container {
    position: relative;
    border-radius: 10px;
    overflow: hidden;
    background: #000;
    margin-bottom: 15px;
}

.image-container img {
    width: 100%;
    max-height: 300px;
    object-fit: contain;
    display: block;
}

.btn-remove {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(220, 53, 69, 0.9);
    color: white;
    border: none;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.2s;
}

.btn-remove:hover {
    transform: scale(1.1);
}

/* Action Button */
.btn-primary {
    background: linear-gradient(135deg, #1E5A8E 0%, #2B7EC1 100%);
    border: none;
    border-radius: 10px;
    padding: 14px;
    font-weight: 600;
    font-size: 1.1rem;
    transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(30, 90, 142, 0.4);
}

.btn-primary:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

/* History List */
.empty-state {
    padding: 40px;
    text-align: center;
    color: #a0aec0;
}

.empty-state i {
    font-size: 48px;
    margin-bottom: 15px;
    color: #cbd5e0;
    display: block;
}

.prescription-list {
    max-height: 500px;
    overflow-y: auto;
}

.prescription-item {
    padding: 20px;
    border-bottom: 1px solid #f0f0f0;
    transition: background 0.2s;
    cursor: pointer;
}

.prescription-item:hover {
    background: #f8fafc;
}

.prescription-item:last-child {
    border-bottom: none;
}

.prescription-item h5 {
    font-size: 1rem;
    font-weight: 600;
    color: #2d3748;
}

.icon-file {
    color: #2B7EC1;
    font-size: 1.2rem;
}

.item-preview {
    font-size: 0.85rem;
    color: #718096;
    background: #edf2f7;
    padding: 8px 12px;
    border-radius: 6px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.result-box {
    background: #f0fff4;
    border: 1px solid #c6f6d5;
    border-radius: 12px;
    padding: 20px;
}

.result-box h5 {
    color: #2f855a;
    font-size: 1rem;
    margin-bottom: 15px;
    font-weight: 600;
}

.result-text {
    background: white;
    font-family: 'Courier New', monospace;
    font-size: 0.9rem;
    color: #2d3748;
    resize: none;
    border: 1px solid #e2e8f0;
}

/* Form Controls */
.form-control {
    width: 100%;
    padding: 12px;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    font-size: 1rem;
}

.form-control:focus {
    border-color: #2B7EC1;
    box-shadow: 0 0 0 3px rgba(43, 126, 193, 0.1);
    outline: none;
}

/* Alerts */
.alert {
    padding: 15px;
    border-radius: 8px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 0.95rem;
}

.alert-danger {
    background: #fff5f5;
    color: #c53030;
    border: 1px solid #feb2b2;
}

.alert-success {
    background: #f0fff4;
    color: #2f855a;
    border: 1px solid #9ae6b4;
}
</style>
