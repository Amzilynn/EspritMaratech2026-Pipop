import { ref, onUnmounted } from 'vue'

export function useVoiceAssistant() {
    const ttsEnabled = ref(localStorage.getItem('tts_enabled') !== 'false')
    const currentlySpeaking = ref<string | null>(null)

    function speak(text: string, fieldId: string | null = null) {
        if (!ttsEnabled.value || !text) return

        // Stop any current speech
        window.speechSynthesis.cancel()

        const utterance = new SpeechSynthesisUtterance(text)
        utterance.lang = 'fr-FR'
        utterance.rate = 0.95

        utterance.onstart = () => {
            currentlySpeaking.value = fieldId
        }

        utterance.onend = () => {
            if (currentlySpeaking.value === fieldId) {
                currentlySpeaking.value = null
            }
        }

        window.speechSynthesis.speak(utterance)
    }

    function stopSpeaking() {
        window.speechSynthesis.cancel()
        currentlySpeaking.value = null
    }

    function toggleTts() {
        ttsEnabled.value = !ttsEnabled.value
        localStorage.setItem('tts_enabled', ttsEnabled.value.toString())
        if (!ttsEnabled.value) {
            stopSpeaking()
        }
    }

    onUnmounted(() => {
        window.speechSynthesis.cancel()
    })

    return {
        ttsEnabled,
        currentlySpeaking,
        speak,
        stopSpeaking,
        toggleTts
    }
}
