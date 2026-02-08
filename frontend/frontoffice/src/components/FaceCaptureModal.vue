<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['captured', 'close'])

const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const stream = ref<MediaStream | null>(null)
const capturedImage = ref<string | null>(null)
const errorMsg = ref('')

onMounted(async () => {
    await startCamera()
})

onUnmounted(() => {
    stopCamera()
})

async function startCamera() {
    try {
        stream.value = await navigator.mediaDevices.getUserMedia({ 
            video: { width: 640, height: 480, facingMode: 'user' } 
        })
        if (videoRef.value) {
            videoRef.value.srcObject = stream.value
        }
    } catch (e: any) {
        errorMsg.value = 'Impossible d\'accéder à la caméra: ' + e.message
    }
}

function stopCamera() {
    if (stream.value) {
        stream.value.getTracks().forEach(track => track.stop())
        stream.value = null
    }
}

function capture() {
    if (videoRef.value && canvasRef.value) {
        const context = canvasRef.value.getContext('2d')
        if (context) {
            context.drawImage(videoRef.value, 0, 0, 640, 480)
            capturedImage.value = canvasRef.value.toDataURL('image/jpeg')
            stopCamera()
        }
    }
}

function retake() {
    capturedImage.value = null
    startCamera()
}

function confirm() {
    if (capturedImage.value) {
        // Convert base64 to Blob
        fetch(capturedImage.value)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], "face_capture.jpg", { type: "image/jpeg" })
                emit('captured', file)
            })
    }
}
</script>

<template>
    <div class="modal-overlay">
        <div class="modal-content">
            <div class="modal-header">
                <h3><i class="fa fa-camera"></i> Scan Visage</h3>
                <button @click="$emit('close')" class="btn-close"><i class="fa fa-times"></i></button>
            </div>
            
            <div class="modal-body">
                <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>
                
                <div class="camera-container">
                    <video 
                        v-show="!capturedImage" 
                        ref="videoRef" 
                        autoplay 
                        playsinline 
                        class="camera-feed"
                    ></video>
                    
                    <img 
                        v-if="capturedImage" 
                        :src="capturedImage" 
                        class="captured-preview" 
                    />
                    
                    <!-- Hidden canvas for capture -->
                    <canvas ref="canvasRef" width="640" height="480" style="display:none"></canvas>
                </div>
                
                <div class="instructions text-center mt-3">
                    <p v-if="!capturedImage">Placez votre visage au centre du cadre</p>
                    <p v-else>Cette photo est-elle claire ?</p>
                </div>
            </div>
            
            <div class="modal-footer">
                <button v-if="!capturedImage" @click="capture" class="btn btn-primary btn-block">
                    <i class="fa fa-camera"></i> Prendre Photo
                </button>
                
                <div v-else class="action-buttons">
                    <button @click="retake" class="btn btn-secondary">
                        <i class="fa fa-refresh"></i> Reprendre
                    </button>
                    <button @click="confirm" class="btn btn-success">
                        <i class="fa fa-check"></i> Confirmer
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.7);
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(5px);
}

.modal-content {
    background: white;
    width: 90%;
    max-width: 500px;
    border-radius: 16px;
    padding: 0;
    overflow: hidden;
    box-shadow: 0 15px 50px rgba(0,0,0,0.3);
}

.modal-header {
    background: #2B7EC1;
    color: white;
    padding: 15px 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.modal-header h3 {
    margin: 0;
    font-size: 1.2rem;
    color: white;
}

.btn-close {
    background: transparent;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
}

.modal-body {
    padding: 20px;
}

.camera-container {
    width: 100%;
    height: 300px;
    background: #000;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
}

.camera-feed, .captured-preview {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scaleX(-1); /* Mirror effect */
}
.captured-preview {
    transform: none; /* Don't mirror static image if preferred, but usually mirror is less confusing */
}

.modal-footer {
    padding: 15px 20px;
    background: #f8f9fa;
    border-top: 1px solid #eee;
}

.btn {
    padding: 12px 20px;
    border-radius: 8px;
    border: none;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.btn:active {
    transform: scale(0.98);
}

.btn-block { width: 100%; }

.btn-primary { background: #2B7EC1; color: white; }
.btn-secondary { background: #636E72; color: white; }
.btn-success { background: #27ae60; color: white; }

.action-buttons {
    display: flex;
    gap: 10px;
}
.action-buttons .btn { flex: 1; }

.alert {
    padding: 10px;
    background: #ffebeb;
    color: #e74c3c;
    border-radius: 6px;
    margin-bottom: 15px;
}
</style>
