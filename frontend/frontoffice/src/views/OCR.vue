<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { apiFetch } from '@/services/api'
import { useVoiceAssistant } from '@/composables/useVoiceAssistant'

const { ttsEnabled, currentlySpeaking, speak, stopSpeaking } = useVoiceAssistant()

// Voice Handlers
const onHoverScanner = () => speak("Zone de téléchargement. Prenez une photo de votre ordonnance.", 'scanner-zone')
const onHoverResult = (text: string) => speak(`Contenu extrait : ${text}`, 'scan-result')
const onHoverHistoryItem = (notes: string, date: string) => speak(`Ordonnance : ${notes}. Enregistrée le ${date}.`, 'history-' + notes)
const onHoverBreadcam = () => speak("Scanner d'ordonnances médicales.", 'bradcam')

const selectedFile = ref<File | null>(null)
const previewUrl = ref<string>('')
const extractedText = ref<string>('')
const isLoading = ref(false)
const errorMsg = ref('')
const successMsg = ref('')
const notes = ref('')
const myPrescriptions = ref<any[]>([])

onMounted(async () => {
    await loadMyPrescriptions()
})

async function loadMyPrescriptions() {
    try {
        const response = await apiFetch('/prescriptions/my-prescriptions')
        myPrescriptions.value = response
    } catch (e) {
        console.error(e)
    }
}

function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (file) {
        if (!file.type.startsWith('image/')) {
            errorMsg.value = 'Sélectionnez une image valide.'
            return
        }
        selectedFile.value = file
        previewUrl.value = URL.createObjectURL(file)
        extractedText.value = ''
        errorMsg.value = ''
    }
}

async function scanAndSave() {
    if (!selectedFile.value) return
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
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        })
        if (!response.ok) throw new Error('Traitement échoué')
        const data = await response.json()
        extractedText.value = data.extractedText
        successMsg.value = 'Ordonnance enregistrée !'
        await loadMyPrescriptions()
    } catch (err: any) {
        errorMsg.value = err.message
    } finally {
        isLoading.value = false
    }
}

function clearImage() {
    selectedFile.value = null
    previewUrl.value = ''
    extractedText.value = ''
    notes.value = ''
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<template>
    <div class="ocr-page">
        <!-- Page Header -->
        <div class="page-header-omnia" @mouseenter="onHoverBreadcam" @mouseleave="stopSpeaking">
            <div class="container-omnia">
                <h1>SCANNER MÉDICAL</h1>
                <p>Numérisez vos ordonnances pour un suivi santé simplifié.</p>
            </div>
        </div>

        <section class="section-padding container-omnia">
            <div class="ocr-layout">
                <!-- Main Scanner -->
                <div class="ocr-main">
                    <div class="card-omnia scanner-card">
                        <div class="scanner-header">
                            <h2><i class="fa fa-plus-square"></i> NOUVELLE ANALYSE</h2>
                        </div>

                        <div v-if="errorMsg" class="alert-omnia error">{{ errorMsg }}</div>
                        <div v-if="successMsg" class="alert-omnia success">{{ successMsg }}</div>

                        <div v-if="!previewUrl" class="upload-area" @mouseenter="onHoverScanner" @mouseleave="stopSpeaking" :class="{ 'tts-highlight': currentlySpeaking === 'scanner-zone' }">
                            <input type="file" id="fileIn" accept="image/*" @change="handleFileSelect" class="sr-only">
                            <label for="fileIn" class="upload-label">
                                <div class="upload-icon"><i class="fa fa-camera"></i></div>
                                <span>Prendre une photo de l'ordonnance <i v-if="ttsEnabled && currentlySpeaking === 'scanner-zone'" class="fa fa-assistive-listening-systems tts-pulse-icon"></i></span>
                                <small>ou choisir un fichier local</small>
                            </label>
                        </div>

                        <div v-else class="preview-area">
                            <div class="preview-container">
                                <img :src="previewUrl" alt="Aperçu de l'ordonnance">
                                <button class="btn-clear" @click="clearImage"><i class="fa fa-times"></i></button>
                            </div>

                            <div class="form-group-omnia mt-4">
                                <label>Titre / Note (Ex: Ophtalmo Janvier 2024)</label>
                                <input v-model="notes" type="text" class="form-control-omnia" placeholder="Libellé de l'ordonnance">
                            </div>

                            <button 
                                class="btn-omnia btn-primary w-100 mt-3" 
                                @click="scanAndSave" 
                                :disabled="isLoading"
                            >
                                <span v-if="isLoading"><i class="fa fa-spinner fa-spin"></i> ANALYSE EN COURS...</span>
                                <span v-else><i class="fa fa-magic"></i> ANALYSER & ENREGISTRER</span>
                            </button>

                            <div v-if="extractedText" class="result-area mt-4" @mouseenter="onHoverResult(extractedText)" @mouseleave="stopSpeaking">
                                <h3>TEXTE EXTRAIT <i v-if="ttsEnabled && currentlySpeaking === 'scan-result'" class="fa fa-assistive-listening-systems tts-pulse-icon"></i></h3>
                                <div class="result-box">
                                    {{ extractedText }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- History -->
                <aside class="ocr-sidebar">
                    <div class="card-omnia history-card">
                        <div class="sidebar-header">
                            <h2>HISTORIQUE</h2>
                        </div>
                        <div class="history-list">
                            <div v-if="myPrescriptions.length === 0" class="empty-history">
                                Aucune ordonnance trouvée.
                            </div>
                            <div 
                                v-for="p in myPrescriptions" 
                                :key="p.id" 
                                class="history-item"
                                @mouseenter="onHoverHistoryItem(p.notes, formatDate(p.createdAt))"
                                @mouseleave="stopSpeaking"
                                :class="{ 'tts-highlight': currentlySpeaking === 'history-' + p.notes }"
                            >
                                <div class="h-icon"><i class="fa fa-file-text"></i></div>
                                <div class="h-info">
                                    <h4>{{ p.notes || 'Sans titre' }} <i v-if="ttsEnabled && currentlySpeaking === 'history-' + p.notes" class="fa fa-assistive-listening-systems tts-pulse-icon"></i></h4>
                                    <span>{{ formatDate(p.createdAt) }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </section>
    </div>
</template>

<style scoped>
.ocr-layout {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: var(--spacing-xl);
}

.scanner-header, .sidebar-header {
    margin-bottom: var(--spacing-lg);
    border-bottom: 2px solid var(--border-color);
    padding-bottom: var(--spacing-sm);
}

.scanner-header h2, .sidebar-header h2 {
    font-size: 24px;
    color: var(--dark-blue);
    font-weight: 800;
}

.upload-area {
    border: 3px dashed var(--border-color);
    padding: var(--spacing-xxl);
    text-align: center;
    border-radius: var(--radius-lg);
    cursor: pointer;
    background: var(--light-blue);
    transition: all 0.3s;
}

.upload-area:hover {
    border-color: var(--primary-blue);
    background: white;
}

.upload-icon {
    font-size: 40px;
    color: var(--primary-blue);
    margin-bottom: var(--spacing-md);
}

.upload-label span {
    display: block;
    font-weight: 700;
    font-size: 18px;
    color: var(--secondary-blue);
}

.preview-container {
    position: relative;
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: #000;
}

.preview-container img {
    width: 100%;
    max-height: 400px;
    object-fit: contain;
}

.btn-clear {
    position: absolute;
    top: 10px;
    right: 10px;
    background: var(--error-red);
    color: white;
    border: none;
    width: 35px;
    height: 35px;
    border-radius: 50%;
    cursor: pointer;
}

.result-area h3 {
    font-size: 18px;
    font-weight: 800;
    color: var(--primary-blue);
    margin-bottom: 12px;
}

.result-box {
    background: #f8f9fa;
    padding: var(--spacing-md);
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    font-family: 'Space Mono', monospace;
    font-size: 16px;
    font-weight: 500;
    max-height: 200px;
    overflow-y: auto;
    color: var(--text-dark);
}

.history-list {
    max-height: 600px;
    overflow-y: auto;
}

.history-item {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
    padding: var(--spacing-md);
    border-bottom: 1px solid var(--border-color);
    transition: background 0.2s;
}

.history-item:hover { background: var(--light-blue); }

.h-icon {
    width: 40px;
    height: 40px;
    background: white;
    border: 1px solid var(--border-color);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    color: var(--primary-blue);
}

.h-info h4 { font-size: 18px; margin-bottom: 4px; font-weight: 700; color: var(--dark-blue); }
.h-info span { font-size: 14px; color: var(--text-dark); font-weight: 500; }

.alert-omnia {
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
    margin-bottom: var(--spacing-lg);
}
.alert-omnia.error { background: #fee2e2; color: #991b1b; }
.alert-omnia.success { background: #dcfce7; color: #166534; }

@media (max-width: 992px) {
    .ocr-layout { grid-template-columns: 1fr; }
}
</style>
