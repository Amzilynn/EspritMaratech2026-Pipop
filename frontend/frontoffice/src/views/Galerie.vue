<script setup lang="ts">
import { ref } from 'vue';

// Gallery images - using available assets from public folder to simulate the gallery experience
const galleryImages = ref([
    { id: 1, src: '/img/causes/1.png', alt: 'Action sociale 1' },
    { id: 2, src: '/img/causes/2.png', alt: 'Action sociale 2' },
    { id: 3, src: '/img/causes/3.png', alt: 'Action sociale 3' },
    { id: 4, src: '/img/causes/4.png', alt: 'Action sociale 4' },
    { id: 5, src: '/img/causes/5.png', alt: 'Action sociale 5' },
    { id: 6, src: '/img/causes/6.png', alt: 'Action sociale 6' },
    { id: 7, src: '/img/blog/single_blog_1.png', alt: 'Evenement 1' },
    { id: 8, src: '/img/blog/single_blog_2.png', alt: 'Evenement 2' },
    { id: 9, src: '/img/blog/single_blog_3.png', alt: 'Evenement 3' },
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
                        <h3>GALERIE PHOTO</h3>
                        <p><router-link to="/" style="color: rgba(255,255,255,0.8); text-decoration: none;">ACCUEIL</router-link> / GALERIE PHOTO</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- bradcam_area_end -->

    <!-- our_gallery_area_start -->
    <div class="our_gallery_area section-padding">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-6">
                    <div class="section_title text-center mb-55">
                        <h3><span>NOS PHOTOS</span></h3>
                    </div>
                </div>
            </div>
            <div class="row gallery-grid">
                <div class="col-xl-4 col-md-6 col-lg-4 mb-4" v-for="image in galleryImages" :key="image.id">
                    <div class="single_gallery">
                        <div class="thumb">
                            <img :src="image.src" :alt="image.alt">
                        </div>
                        <div class="gallery_hover">
                            <div class="hover_inner">
                                <a :href="image.src" class="gallery_icon">
                                    <i class="ti-plus"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- our_gallery_area_end -->

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

.gallery-grid {
    margin-top: 30px;
}

.single_gallery {
    position: relative;
    border-radius: 5px;
    overflow: hidden;
    margin-bottom: 30px;
}

.single_gallery .thumb img {
    width: 100%;
    height: 300px;
    object-fit: cover;
    transition: 0.3s;
    border-radius: 5px;
}

.single_gallery:hover .thumb img {
    transform: scale(1.1);
}

.gallery_hover {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(43, 126, 193, 0.6); /* --primary-blue with opacity */
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: 0.3s;
    border-radius: 5px;
}

.single_gallery:hover .gallery_hover {
    opacity: 1;
    visibility: visible;
}

.hover_inner .gallery_icon {
    font-size: 30px;
    color: #fff;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    border: 2px solid #fff;
    border-radius: 50%;
    display: inline-block;
}

.section_title h3 span {
    color: #2D3436;
    font-size: 36px;
    font-weight: 700;
    position: relative;
    display: inline-block;
    padding-bottom: 15px;
}

.section_title h3 span::before {
    content: "";
    position: absolute;
    left: 0;
    bottom: 0;
    width: 40px;
    height: 3px;
    background: var(--primary-blue, #2B7EC1);
}
</style>