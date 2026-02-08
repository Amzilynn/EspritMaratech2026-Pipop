<script setup lang="ts">
import { useVoiceAssistant } from '@/composables/useVoiceAssistant'

const { ttsEnabled, currentlySpeaking, speak, stopSpeaking } = useVoiceAssistant()

const onHoverReason = () => speak("Pourquoi faire un don ? Votre soutien permet de financer nos projets humanitaires et de démultiplier notre impact sur le terrain.", 'reason')
const onHoverBank = () => speak("Coordonnées bancaires pour virement. Titulaire : ASS OMNIA. RIB : 08 005 0100 820 219 940 17.", 'bank')
const onHoverBreadcam = () => speak("Faire un don. Soutenez nos actions humanitaires.", 'bradcam')
</script>

<template>
    <div class="donate-page">
        <!-- Page Header -->
        <div class="page-header-omnia" @mouseenter="onHoverBreadcam" @mouseleave="stopSpeaking">
            <div class="container-omnia">
                <h1>SOUTENEZ NOTRE CAUSE</h1>
                <p>Chaque geste compte. Votre générosité est le moteur de nos actions.</p>
            </div>
        </div>

        <section class="section-padding container-omnia">
            <div class="donate-layout">
                <!-- Why Donate -->
                <div class="donate-info" @mouseenter="onHoverReason" @mouseleave="stopSpeaking">
                    <div class="card-omnia h-100" :class="{ 'tts-highlight': currentlySpeaking === 'reason' }">
                        <div class="icon-box"><i class="fa fa-heart"></i></div>
                        <h2>Pourquoi faire un don ? <i v-if="ttsEnabled && currentlySpeaking === 'reason'" class="fa fa-assistive-listening-systems tts-pulse-icon"></i></h2>
                        <div class="section-line left"></div>
                        <p><strong>Un simple don</strong> permet de démultiplier l'efficacité des actions de l'association Omnia sur le terrain.</p>
                        <p>Grâce à votre contribution, nous pouvons :</p>
                        <ul>
                            <li>Financer des kits médicaux et scolaires</li>
                            <li>Soutenir les familles en difficulté</li>
                            <li>Assurer la logistique de nos missions humanitaires</li>
                            <li>Développer de nouveaux projets d'entraide</li>
                        </ul>
                        <p class="mt-4">En faisant un don, vous devenez un maillon essentiel de notre chaîne de solidarité.</p>
                    </div>
                </div>

                <!-- How to Donate -->
                <div class="donate-method" @mouseenter="onHoverBank" @mouseleave="stopSpeaking">
                    <div class="card-omnia h-100 highlight-card" :class="{ 'tts-highlight': currentlySpeaking === 'bank' }">
                        <div class="icon-box"><i class="fa fa-university"></i></div>
                        <h2>Comment faire un don ? <i v-if="ttsEnabled && currentlySpeaking === 'bank'" class="fa fa-assistive-listening-systems tts-pulse-icon"></i></h2>
                        <div class="section-line left"></div>
                        <p class="mb-4">Le moyen le plus direct est le <strong>virement bancaire</strong> :</p>
                        
                        <div class="bank-details-box">
                            <div class="detail-row">
                                <span class="label">TITULAIRE</span>
                                <span class="value">ASSOCIATION OMNIA</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">RIB (TUNISIE)</span>
                                <span class="value">08 005 0100 820 219 940 17</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">IBAN</span>
                                <span class="value">TN59 0800 5010 0820 2199 4017</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">CODE BIC / SWIFT</span>
                                <span class="value">BIAT NTT T</span>
                            </div>
                            <div class="detail-row">
                                <span class="label">AGENCE</span>
                                <span class="value">BIAT AVENUE MOHAMED V, TUNIS</span>
                            </div>
                        </div>

                        <div class="info-note mt-4">
                            <i class="fa fa-info-circle"></i>
                            Une attestation de don peut vous être délivrée sur simple demande par email.
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Transparency Section -->
        <section class="section-padding bg-light-blue">
            <div class="container-omnia text-center">
                <div class="transparency-content">
                    <i class="fa fa-shield fa-3x mb-3 text-primary"></i>
                    <h2>TRANSPARENCE TOTALE</h2>
                    <p class="max-600 mx-auto">100% de vos dons sont affectés aux projets de terrain. Nous publions régulièrement les rapports d'utilisation des fonds pour chaque mission.</p>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.donate-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-xxl);
}

.icon-box {
    font-size: 32px;
    color: var(--primary-blue);
    margin-bottom: var(--spacing-md);
}

.section-line.left { margin-left: 0; margin-bottom: var(--spacing-lg); }

.donate-info ul {
    list-style: none;
    padding: 0;
    margin-top: var(--spacing-md);
}

.donate-info p {
    font-size: 1.25rem;
    line-height: 1.6;
}

.donate-info ul li {
    padding-left: 25px;
    position: relative;
    margin-bottom: 12px;
    font-weight: 600;
    font-size: 1.1rem;
}

.donate-info ul li::before {
    content: "\f00c";
    font-family: FontAwesome;
    position: absolute;
    left: 0;
    color: var(--success-green);
}

.highlight-card {
    border: 2px solid var(--primary-blue);
    background: #fdfdfd;
}

.bank-details-box {
    background: white;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    padding: var(--spacing-lg);
}

.detail-row {
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
}

.detail-row:last-child { margin-bottom: 0; }

.detail-row .label {
    font-size: 14px;
    font-weight: 800;
    color: var(--secondary-blue);
    letter-spacing: 0.5px;
}

.detail-row .value {
    font-size: 18px;
    font-weight: 700;
    color: var(--dark-blue);
    font-family: 'Space Mono', monospace;
}

.info-note {
    background: #e8f4fd;
    color: #1e5a8e;
    padding: var(--spacing-md);
    border-radius: var(--radius-sm);
    font-size: 15px;
    font-weight: 600;
}

.bg-light-blue { background: var(--light-blue); }
.text-primary { color: var(--primary-blue); }
.max-600 { max-width: 600px; margin: 0 auto; }

@media (max-width: 992px) {
    .donate-layout { grid-template-columns: 1fr; }
}
</style>