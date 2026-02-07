<script setup lang="ts">
import { ref } from 'vue';

// Mock data (simulating data from Backoffice)
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
        title: 'Visite chez Famille Ben Ali',
        type: 'Visite',
        date: '15 Octobre 2023',
        day: '15', month: 'Oct',
        description: 'Visite de contrôle annuelle dans la région de Jendouba. La situation de la famille est stable. Nous avons identifié quelques besoins pour la rentrée scolaire.',
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
        title: 'Aide Médicale - Mme. Trabelsi',
        type: 'Aide',
        date: '20 Novembre 2023',
        day: '20', month: 'Nov',
        description: 'Prise en charge des frais médicaux et médicaments urgents. Le suivi est assuré par notre équipe santé.',
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
    { title: 'TEST ARTICLE', image: 'https://placehold.co/80x80', date: 'Jan 12' },
    { title: 'HIVER AU CHAUD 3.0', image: 'https://placehold.co/80x80', date: 'Dec 05' },
    { title: 'Rentrée Scolaire', image: 'https://placehold.co/80x80', date: 'Sep 15' }
]);
</script>

<template>
    <!-- header-start -->
    <header>
        <div class="header-area">
            <div class="header-top_area">
                <div class="container-fluid">
                    <div class="row align-items-center">
                        <div class="col-xl-5 col-md-12 col-lg-6">
                            <div class="short_contact_list">
                                <ul>
                                    <li><a href="tel:+21698534849"><i class="fa fa-phone"></i> (+216) 98 534 849</a></li>
                                    <li><a href="mailto:omniatn.charity@gmail.com"><i class="fa fa-envelope"></i> omniatn.charity@gmail.com</a></li>
                                </ul>
                            </div>
                        </div>
                        <div class="col-xl-7 col-md-6 col-lg-6">
                            <div class="d-none d-lg-flex justify-content-end align-items-center" style="gap: 15px;">
                                <div class="social_media_links">
                                    <a href="#"><i class="fa fa-facebook"></i></a>
                                    <a href="#"><i class="fa fa-instagram"></i></a>
                                    <a href="#"><i class="fa fa-linkedin"></i></a>
                                </div>
                                <div class="auth-buttons">
                                    <router-link to="/login" class="btn-signin">Se Connecter</router-link>
                                    <router-link to="/register" class="btn-signup">S'inscrire</router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="sticky-header" class="main-header-area">
                <div class="container-fluid">
                    <div class="row align-items-center">
                        <div class="col-xl-3 col-lg-3">
                            <div class="logo">
                                <router-link to="/" style="color: #fff; font-weight: bold; font-size: 32px; text-decoration: none;">
                                    Omnia
                                </router-link>
                            </div>
                        </div>
                        <div class="col-xl-9 col-lg-9">
                            <div class="main-menu">
                                <nav>
                                    <ul id="navigation">
                                        <li><router-link to="/">ACCUEIL</router-link></li>
                                        <li><router-link to="/bureau">BUREAU</router-link></li>
                                        <li><router-link to="/actions">ACTIONS</router-link></li>
                                        <li><router-link to="/galerie">GALERIE</router-link></li>
                                        <li><router-link to="/partners">NOS PARTENAIRES</router-link></li>
                                        <li><router-link to="/contact">CONTACT</router-link></li>
                                    </ul>
                                </nav>
                                <div class="Appointment">
                                    <div class="book_btn d-none d-lg-block">
                                        <router-link to="/donate">FAIRE UN DON</router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="col-12">
                            <div class="mobile_menu d-block d-lg-none"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </header>
    <!-- header-end -->

    <!-- bradcam_area_start -->
    <div class="bradcam_area breadcam_bg overlay d-flex align-items-center justify-content-center">
        <div class="container">
            <div class="row">
                <div class="col-xl-12">
                    <div class="bradcam_text text-center">
                        <h3>ACTIONS</h3>
                        <p><router-link to="/" style="color: rgba(255,255,255,0.8); text-decoration: none;">ACCUEIL</router-link> / ACTIONS</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- bradcam_area_end -->

    <!--================Blog Area =================-->
    <section class="blog_area section-padding">
        <div class="container">
            <div class="row">
                <!-- Sidebar (Left) -->
                <div class="col-lg-4">
                    <div class="blog_right_sidebar">
                        <aside class="single_sidebar_widget popular_post_widget">
                            <h3 class="widget_title" style="border-left: 4px solid var(--primary-blue, #2B7EC1); padding-left: 15px;">PUBLICATIONS RÉCENTS</h3>
                            
                            <div class="media post_item" v-for="(post, index) in recentPosts" :key="index">
                                <img :src="post.image" alt="post" style="width: 80px; height: 80px; object-fit: cover;">
                                <div class="media-body">
                                    <a href="#">
                                        <h3>{{ post.title }}</h3>
                                    </a>
                                    <p>{{ post.date }}</p>
                                </div>
                            </div>
                        </aside>
                         <aside class="single_sidebar_widget search_widget">
                            <form action="#">
                                <div class="form-group">
                                    <div class="input-group mb-3">
                                        <input type="text" class="form-control" placeholder='Rechercher'
                                            onfocus="this.placeholder = ''"
                                            onblur="this.placeholder = 'Rechercher'">
                                        <div class="input-group-append">
                                            <button class="btn" type="button"><i class="ti-search"></i></button>
                                        </div>
                                    </div>
                                </div>
                                <button class="button rounded-0 primary-bg text-white w-100 btn_1 boxed-btn"
                                    type="submit" style="background: var(--primary-blue, #2B7EC1); border-color: var(--primary-blue, #2B7EC1);">Chercher</button>
                            </form>
                        </aside>
                    </div>
                </div>

                <!-- Main Content (Right) -->
                <div class="col-lg-8 mb-5 mb-lg-0">
                    <div class="blog_left_sidebar">
                        <article class="blog_item" v-for="action in actions" :key="action.id">
                            <div class="blog_item_img">
                                <img class="card-img rounded-0" :src="action.image" :alt="action.title">
                                <a href="#" class="blog_item_date">
                                    <h3>{{ action.day }}</h3>
                                    <p>{{ action.month }}</p>
                                </a>
                            </div>

                            <div class="blog_details">
                                <a class="d-inline-block" href="#">
                                    <h2>{{ action.title }}</h2>
                                </a>
                                <p>{{ action.description }}</p>
                                <ul class="blog-info-link">
                                    <li><a href="#"><i class="fa fa-user"></i> {{ action.type }}</a></li>
                                    <li><a href="#"><i class="fa fa-comments"></i> {{ action.comments_count || 0 }} Commentaires</a></li>
                                </ul>
                            </div>
                        </article>

                        <nav class="blog-pagination justify-content-center d-flex">
                            <ul class="pagination">
                                <li class="page-item">
                                    <a href="#" class="page-link" aria-label="Previous">
                                        <i class="ti-angle-left"></i>
                                    </a>
                                </li>
                                <li class="page-item">
                                    <a href="#" class="page-link">1</a>
                                </li>
                                <li class="page-item active">
                                    <a href="#" class="page-link" style="background-color: var(--primary-blue, #2B7EC1); border-color: var(--primary-blue, #2B7EC1);">2</a>
                                </li>
                                <li class="page-item">
                                    <a href="#" class="page-link" aria-label="Next">
                                        <i class="ti-angle-right"></i>
                                    </a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </div>
    </section>
    <!--================Blog Area =================-->

    <!-- footer_start -->
    <footer class="footer">
        <div class="footer_top">
            <div class="container">
                <div class="row">
                    <div class="col-xl-4 col-md-6 col-lg-4">
                        <div class="footer_widget">
                            <h3 class="footer_title" style="border-left: 3px solid var(--primary-blue, #2B7EC1); padding-left: 12px;">À PROPOS</h3>
                            <p class="address_text">
                                Omnia est une Association humanitaire à but non lucratif régie par la loi de 2011,
                                née de la volonté de jeunes Tunisiens désirant réaliser des missions humanitaires.
                            </p>
                            <div class="socail_links">
                                <ul>
                                    <li><a href="#"><i class="ti-facebook"></i></a></li>
                                    <li><a href="#"><i class="fa fa-instagram"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-4 col-md-6 col-lg-4">
                        <div class="footer_widget">
                            <h3 class="footer_title" style="border-left: 3px solid var(--primary-blue, #2B7EC1); padding-left: 12px;">SITE MAP</h3>
                            <ul class="links">
                                <li><a href="#">Acceuil</a></li>
                                <li><a href="#">Bureau</a></li>
                                <li><a href="#">Action</a></li>
                                <li><router-link to="/donate">Faire un don</router-link></li>
                                <li><a href="#">Nous Rejoindre</a></li>
                                <li><a href="#">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-xl-4 col-md-6 col-lg-4">
                        <div class="footer_widget">
                            <h3 class="footer_title" style="border-left: 3px solid var(--primary-blue, #2B7EC1); padding-left: 12px;">NEWSLETTER</h3>
                            <p>Abonnez vous à notre newsletter pour suivre nos actions.</p>
                            <form action="#" class="newsletter_form">
                                <input type="email" placeholder="Votre e-mail et appuyez sur Entrée" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; border-radius: 4px;">
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="copy-right_text" style="background: var(--primary-blue, #2B7EC1);">
            <div class="container">
                <div class="row">
                    <div class="col-xl-12">
                        <p class="copy_right text-center" style="color: #fff; padding: 15px 0;">
                            Copyright &copy; {{ new Date().getFullYear() }} Association Omnia
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    <!-- footer_end -->
</template>

<style scoped>
.breadcam_bg {
    background-image: url(/img/banner/bradcam.png);
    background-size: cover;
    background-position: center;
    min-height: 350px;
}
/* Ensure pagination active state uses our color */
.page-item.active .page-link {
    background-color: var(--primary-blue, #2B7EC1);
    border-color: var(--primary-blue, #2B7EC1);
}
</style>