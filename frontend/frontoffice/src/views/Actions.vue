<script setup lang="ts">
import { ref } from 'vue';
import { useVoiceAssistant } from '@/composables/useVoiceAssistant'

const { ttsEnabled, currentlySpeaking, speak, stopSpeaking } = useVoiceAssistant()

const onHoverAction = (title: string, desc: string) => speak(`Action humanitaire : ${title}. ${desc}`, 'action-' + title)
const onHoverBreadcam = () => speak(`Vous êtes dans la section Nos Actions.`, 'bradcam')

// Mock data
interface Action {
    id: number;
    title: string;
    description: string;
    date: string; 
    month: string;
    day: string;
    type: 'Visite' | 'Aide';
    image: string;
    comments_count?: number;
}

const actions = ref<Action[]>([
    {
        id: 1,
        title: 'Visite de terrain - Kasserine',
        type: 'Visite',
        date: '15 Octobre 2023',
        day: '15', month: 'Oct',
        description: 'Visite de contrôle annuelle pour évaluer les besoins en infrastructure. La situation locale nécessite une intervention pour l\'accès à l\'eau potable.',
        image: 'https://placehold.co/800x400?text=Visite+Terrain',
        comments_count: 2
    },
    {
        id: 2,
        title: 'Distribution Alimentaire - Hiver',
        type: 'Aide',
        date: '01 Décembre 2023',
        day: '01', month: 'Déc',
        description: 'Distribution de paniers alimentaires et couvertures pour 50 familles. Merci à nos donateurs.',
        image: 'https://placehold.co/800x400/2B7EC1/FFFFFF?text=Aide+Hiver',
        comments_count: 5
    },
    {
        id: 3,
        title: 'Aide Médicale d\'Urgence',
        type: 'Aide',
        date: '20 Novembre 2023',
        day: '20', month: 'Nov',
        description: 'Prise en charge des frais d\'hospitalisation pour une chirurgie vitale. Le patient est actuellement en convalescence sous notre supervision.',
        image: 'https://placehold.co/800x400/F5A623/FFFFFF?text=Aide+Medicale'
    },
    {
        id: 4,
        title: 'Visite de Suivi',
        type: 'Visite',
        date: '10 Janvier 2024',
        day: '10', month: 'Jan',
        description: 'Visite régulière pour vérifier l\'état des rénovations effectuées le mois dernier.',
        image: 'https://placehold.co/800x400?text=Suivi+Projet'
    }
]);

const recentPosts = ref([
    { title: 'Hiver au Chaud 3.0', image: 'https://placehold.co/80x80', date: 'Dec 05' },
    { title: 'Rentrée Scolaire', image: 'https://placehold.co/80x80', date: 'Sep 15' }
]);
</script>

<template>
    <div class="actions-page">
        <!-- Page Header -->
        <div class="page-header-omnia" @mouseenter="onHoverBreadcam" @mouseleave="stopSpeaking">
            <div class="container-omnia">
                <h1>NOS ACTIONS</h1>
                <p>Découvrez l'impact de nos interventions sur le terrain.</p>
            </div>
        </div>

        <section class="section-padding container-omnia">
            <div class="actions-layout">
                <!-- Main Content -->
                <div class="actions-list">
                    <article 
                        v-for="action in actions" 
                        :key="action.id" 
                        class="card-omnia action-item"
                        @mouseenter="onHoverAction(action.title, action.description)"
                        @mouseleave="stopSpeaking"
                        :class="{ 'tts-highlight': currentlySpeaking === 'action-' + action.title }"
                    >
                        <div class="action-img-container">
                            <img :src="action.image" :alt="action.title" class="action-img">
                            <div class="action-badge" :class="action.type.toLowerCase()">{{ action.type }}</div>
                        </div>
                        <div class="action-body">
                            <div class="action-meta">
                                <span class="date"><i class="fa fa-calendar"></i> {{ action.date }}</span>
                                <span class="comments"><i class="fa fa-comments"></i> {{ action.comments_count || 0 }} Commentaires</span>
                            </div>
                            <h2>{{ action.title }} <i v-if="ttsEnabled && currentlySpeaking === 'action-' + action.title" class="fa fa-assistive-listening-systems tts-pulse-icon"></i></h2>
                            <p>{{ action.description }}</p>
                            <a href="#" class="btn-omnia btn-outline">VOIR LES DÉTAILS <span class="sr-only">de l'action {{ action.title }}</span></a>
                        </div>
                    </article>

                    <!-- Pagination -->
                    <div class="pagination-container" aria-label="Pagination des actions">
                        <button class="btn-pagination" disabled aria-label="Page précédente"><i class="fa fa-angle-left"></i></button>
                        <span class="page-active">1</span>
                        <button class="btn-pagination">2</button>
                        <button class="btn-pagination" aria-label="Page suivante"><i class="fa fa-angle-right"></i></button>
                    </div>
                </div>

                <!-- Sidebar -->
                <aside class="actions-sidebar">
                    <div class="card-omnia sidebar-widget">
                        <h3>RECHERCHER</h3>
                        <div class="search-form">
                            <label for="search-input" class="sr-only">Rechercher une action</label>
                            <div class="input-with-icon">
                                <input type="text" id="search-input" class="form-control-omnia" placeholder="Mots-clés...">
                                <button class="search-btn" aria-label="Lancer la recherche"><i class="fa fa-search"></i></button>
                            </div>
                        </div>
                    </div>

                    <div class="card-omnia sidebar-widget">
                        <h3>DERNIÈRES PUBLICATIONS</h3>
                        <div class="recent-posts">
                            <div v-for="(post, idx) in recentPosts" :key="idx" class="recent-post-item">
                                <img :src="post.image" :alt="post.title">
                                <div class="post-info">
                                    <h4>{{ post.title }}</h4>
                                    <span>{{ post.date }}</span>
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
.actions-layout {
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: var(--spacing-xl);
}

.actions-list {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xl);
}

.action-item {
    padding: 0;
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.action-img-container {
    position: relative;
    height: 300px;
}

.action-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.action-badge {
    position: absolute;
    top: var(--spacing-md);
    left: var(--spacing-md);
    padding: 6px 16px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 12px;
    color: white;
}

.action-badge.visite { background-color: var(--primary-blue); }
.action-badge.aide { background-color: var(--accent-gold); }

.action-body {
    padding: var(--spacing-xl);
}

.action-meta {
    display: flex;
    gap: 20px;
    font-size: 16px;
    color: var(--text-muted);
    font-weight: 600;
    margin-bottom: var(--spacing-sm);
}

.action-body h2 {
    margin-bottom: var(--spacing-md);
}

.action-body p {
    color: var(--text-dark);
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: var(--spacing-lg);
}

.pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 12px;
    margin-top: var(--spacing-xl);
}

.btn-pagination {
    width: 44px;
    height: 44px;
    border: 1px solid var(--border-color);
    background: white;
    border-radius: var(--radius-md);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
}

.btn-pagination:hover:not(:disabled) {
    border-color: var(--primary-blue);
    color: var(--primary-blue);
}

.btn-pagination:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.page-active {
    width: 44px;
    height: 44px;
    background: var(--primary-blue);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-md);
    font-weight: 700;
}

.sidebar-widget {
    margin-bottom: var(--spacing-xl);
    padding: var(--spacing-lg);
}

.sidebar-widget h3 {
    font-size: 18px;
    border-left: 4px solid var(--accent-gold);
    padding-left: 12px;
    margin-bottom: var(--spacing-lg);
}

.input-with-icon {
    position: relative;
}

.search-btn {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
}

.recent-post-item {
    display: flex;
    gap: 12px;
    margin-bottom: var(--spacing-md);
    padding-bottom: var(--spacing-md);
    border-bottom: 1px solid var(--border-color);
}

.recent-post-item:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
}

.recent-post-item img {
    width: 64px;
    height: 64px;
    border-radius: 4px;
    object-fit: cover;
}

.post-info h4 {
    font-size: 14px;
    margin-bottom: 4px;
    color: var(--dark-blue);
}

.post-info span {
    font-size: 12px;
    color: var(--text-muted);
}

@media (max-width: 992px) {
    .actions-layout {
        grid-template-columns: 1fr;
    }
}
</style>