<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Defines for MediaPipe globals loaded via CDN
const mpHands = (window as any).Hands
const mpCamera = (window as any).Camera

const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const isEnabled = ref(false)
const isExpanded = ref(false)
const isLoading = ref(false)
const errorMsg = ref('')

// State for gesture logic
let camera: any = null
let hands: any = null
let preventScroll = false
let lastY: number | null = null
let scrollSpeed = 15 // Multiplier for scroll speed
let smoothX: number | null = null
let smoothY: number | null = null

// Virtual Cursor State
const cursorX = ref(0)
const cursorY = ref(0)
const isPinching = ref(false)
const showCursor = ref(false)

// Toggle function
async function toggleGestures() {
    if (isEnabled.value) {
        stopCamera()
    } else {
        await startCamera()
    }
}

async function startCamera() {
    isLoading.value = true
    errorMsg.value = ''
    try {
        if (!hands) {
            hands = new mpHands({locateFile: (file: string) => {
                return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
            }})
            
            hands.setOptions({
                maxNumHands: 1,
                modelComplexity: 0, // Lite model for speed
                minDetectionConfidence: 0.7,
                minTrackingConfidence: 0.7
            })
            
            hands.onResults(onResults)
        }

        if (videoRef.value && !camera) {
            const Camera = (window as any).Camera
            camera = new Camera(videoRef.value, {
                onFrame: async () => {
                    if (hands && videoRef.value) {
                        try {
                            await hands.send({image: videoRef.value})
                        } catch (e) {
                            console.error('MediaPipe error:', e)
                        }
                    }
                },
                width: 640,
                height: 480
            })
            await camera.start()
        }
        
        isEnabled.value = true
        isExpanded.value = true
    } catch (e: any) {
        console.error("Failed to start camera", e)
        errorMsg.value = 'Erreur caméra: ' + (e.message || 'Non dispo')
        isEnabled.value = false
    } finally {
        isLoading.value = false
    }
}

function stopCamera() {
    if (camera) {
        camera.stop()
        camera = null
    }
    isEnabled.value = false
    isExpanded.value = false
    showCursor.value = false
}

// Main Logic Loop
function onResults(results: any) {
    if (!canvasRef.value || !videoRef.value) return

    const canvasCtx = canvasRef.value.getContext('2d')
    if (!canvasCtx) return

    // Draw video feed
    canvasCtx.save()
    canvasCtx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
    canvasCtx.drawImage(results.image, 0, 0, canvasRef.value.width, canvasRef.value.height)

    // Check hands
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        const landmarks = results.multiHandLandmarks[0]
        
        // Draw landmarks
        drawLandmarks(canvasCtx, landmarks)

        // Logic - Index Finger Tip (8)
        const indexTip = landmarks[8]
        const thumbTip = landmarks[4]
        
        // 1. Move Cursor
        // Invert X because webcam is mirrored usually, but let's check
        // Normalized coordinates [0,1]
        
        const screenX = (1 - indexTip.x) * window.innerWidth
        const screenY = indexTip.y * window.innerHeight
        
        // Smoothing
        const alpha = 0.2
        if (smoothX === null || smoothY === null) {
            smoothX = screenX
            smoothY = screenY
        } else {
            smoothX = alpha * screenX + (1 - alpha) * smoothX
            smoothY = alpha * screenY + (1 - alpha) * smoothY
        }

        cursorX.value = smoothX
        cursorY.value = smoothY
        showCursor.value = true

        // 2. Scroll Logic (Vertical Movement)
        // Check wrist or index relative movement
        const currentY = indexTip.y
        
        if (lastY !== null) {
            const deltaY = (currentY - lastY)
            // Threshold to reduce jitter
            if (Math.abs(deltaY) > 0.005) {
                // Scroll direction: Hand down -> Scroll down (Page goes up)
                // Actually if hand moves down, user expects to pull page? Or cursor moves down?
                // Let's map hand moving down (y increases) to scrolling down (scrollTop increases)
                 window.scrollBy(0, deltaY * window.innerHeight * 2) 
            }
        }
        lastY = currentY

        // 3. Click/Pinch Logic
        const distance = Math.hypot(
            (indexTip.x - thumbTip.x),
            (indexTip.y - thumbTip.y)
        )
        
        // Thresholds in normalized units
        // Approx 0.05 is good for pinch
        if (distance < 0.05) {
            if (!isPinching.value) {
                isPinching.value = true
                triggerClick(screenX, screenY)
            }
        } else if (distance > 0.08) {
             isPinching.value = false
        }

    } else {
        lastY = null
        showCursor.value = false
    }
    canvasCtx.restore()
}

function drawLandmarks(ctx: CanvasRenderingContext2D, landmarks: any) {
    const drawingUtils = (window as any)
    if (drawingUtils.drawConnectors && drawingUtils.drawLandmarks) {
        drawingUtils.drawConnectors(ctx, landmarks, (window as any).HAND_CONNECTIONS,
            {color: '#00FF00', lineWidth: 2});
        drawingUtils.drawLandmarks(ctx, landmarks,
            {color: '#FF0000', lineWidth: 1});
    }
}

function triggerClick(x: number, y: number) {
    // Hide cursor temporarily to click element underneath
    const el = document.elementFromPoint(x, y)
    if (el) {
        (el as HTMLElement).click()
        // Visual feedback
        createClickRipple(x, y)
    }
}

function createClickRipple(x: number, y: number) {
    const ripple = document.createElement('div')
    ripple.className = 'gesture-ripple'
    ripple.style.left = `${x}px`
    ripple.style.top = `${y}px`
    document.body.appendChild(ripple)
    setTimeout(() => {
        ripple.remove()
    }, 600)
}

onUnmounted(() => {
    stopCamera()
    if (hands) {
        hands.close()
    }
})
</script>

<template>
    <div class="gesture-control-container">
        <!-- Floating Toggle Button -->
        <button 
            @click="toggleGestures" 
            class="gesture-toggle"
            :class="{ 'active': isEnabled }"
            title="Activer/Désactiver le contrôle gestuel"
        >
            <i class="fa fa-hand-paper-o"></i>
        </button>

        <!-- Control Panel (Video Preview) -->
        <div v-show="isExpanded && isEnabled" class="gesture-panel">
            <div class="panel-header">
                <h6>Contrôle Gestuel</h6>
                <button @click="isExpanded = false" class="btn-close-panel">
                    <i class="fa fa-minus"></i>
                </button>
            </div>
            
            <div class="video-container">
                <video ref="videoRef" class="input_video" style="display:none"></video>
                <canvas ref="canvasRef" class="output_canvas" width="320" height="240"></canvas>
            </div>
            
            <div class="instructions">
                <small>👋 Bougez la main pour scroller</small>
                <small>👌 Pincez pour cliquer</small>
            </div>
        </div>

        <!-- Hidden video element when panel is closed but active -->
        <div v-show="isEnabled && !isExpanded" style="display:none">
             <!-- Video ref needs to exist in DOM for Camera util -->
        </div>

        <!-- Error Message -->
        <div v-if="errorMsg" class="error-toast">
            {{ errorMsg }}
        </div>
    </div>

    <!-- Virtual Cursor -->
    <Teleport to="body">
        <div 
            v-if="showCursor && isEnabled" 
            class="virtual-cursor"
            :class="{ 'clicking': isPinching }"
            :style="{ left: cursorX + 'px', top: cursorY + 'px' }"
        ></div>
    </Teleport>
</template>

<style>
/* Global styles for ripple effect */
.gesture-ripple {
    position: fixed;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: rgba(43, 126, 193, 0.5);
    transform: translate(-50%, -50%);
    animation: ripple-anim 0.6s ease-out forwards;
    pointer-events: none;
    z-index: 10000;
}

@keyframes ripple-anim {
    0% { width: 20px; height: 20px; opacity: 1; }
    100% { width: 60px; height: 60px; opacity: 0; }
}

/* Component Styles */
.gesture-control-container {
    position: fixed;
    bottom: 30px;
    left: 30px; /* Left side to avoid conflict with chat widgets etc */
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-family: 'Segoe UI', sans-serif;
}

.gesture-toggle {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: white;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    border: none;
    color: #636E72;
    font-size: 24px;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
}

.gesture-toggle.active {
    background: #2B7EC1; /* Primary Blue */
    color: white;
    transform: scale(1.1);
}

.gesture-panel {
    margin-bottom: 15px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    overflow: hidden;
    width: 320px;
    animation: slide-up 0.3s ease-out;
}

@keyframes slide-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.panel-header {
    background: #2B7EC1;
    color: white;
    padding: 10px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.panel-header h6 {
    margin: 0;
    font-weight: 600;
    color: white;
}

.btn-close-panel {
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
}

.video-container {
    position: relative;
    width: 320px;
    height: 240px;
    background: #000;
}

.output_canvas {
    width: 100%;
    height: 100%;
}

.instructions {
    padding: 10px;
    background: #f8f9fa;
    display: flex;
    justify-content: space-around;
    border-top: 1px solid #eee;
}

.instructions small {
    color: #636E72;
    font-weight: 600;
}

.error-toast {
    position: absolute;
    bottom: 60px;
    left: 0;
    background: #d63031;
    color: white;
    padding: 10px 15px;
    border-radius: 8px;
    font-size: 13px;
    white-space: nowrap;
}

/* Virtual Cursor */
.virtual-cursor {
    position: fixed;
    width: 24px;
    height: 24px;
    border: 3px solid #F5A623; /* Gold Accent */
    border-radius: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none; /* Let clicks pass through if we didn't handle them manually */
    z-index: 10000;
    transition: width 0.1s, height 0.1s, background-color 0.1s;
    box-shadow: 0 0 10px rgba(245, 166, 35, 0.5);
    background: rgba(255,255,255,0.2);
}

.virtual-cursor.clicking {
    background-color: #F5A623;
    width: 20px;
    height: 20px;
}

/* Cursor Dot Center */
.virtual-cursor::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 4px;
    height: 4px;
    background: white;
    border-radius: 50%;
}
</style>
