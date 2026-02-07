<script setup lang="ts">
import { ref } from 'vue';

// Partners data
// Using placeholders as specific logo files were not found in the project structure
// In a real scenario, upload these logos to /img/partners/
const partners = ref([
    { id: 1, name: 'Digital Natives', src: 'https://placehold.co/200x100?text=Digital+Natives' },
    { id: 2, name: 'Natilait', src: 'https://placehold.co/200x100?text=Natilait' },
    { id: 3, name: 'Baby Motif', src: 'https://placehold.co/200x100?text=Baby+Motif' },
    { id: 4, name: 'XUL Print', src: 'https://placehold.co/200x100?text=XUL+Print' },
    { id: 5, name: 'Koukou Kafe', src: 'https://placehold.co/200x100?text=Koukou+Kafe' },
    { id: 6, name: 'Parcel', src: 'https://placehold.co/200x100?text=Parcel' },
    { id: 7, name: 'LBM', src: 'https://placehold.co/200x100?text=LBM' },
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
                        <h3>NOS PARTENAIRES</h3>
                        <p><router-link to="/" style="color: rgba(255,255,255,0.8); text-decoration: none;">ACCUEIL</router-link> / NOS PARTENAIRES</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- bradcam_area_end -->

    <!-- partners_area_start -->
    <div class="our_volunteer_area section_padding">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-6">
                    <div class="section_title text-center mb-55">
                        <h3><span>NOS PARTENAIRES</span></h3>
                        <p style="margin-top: 10px;">Ils nous soutiennent dans nos actions humanitaires.</p>
                    </div>
                </div>
            </div>
            
            <div class="row justify-content-center align-items-center">
                <div class="col-lg-3 col-md-4 col-sm-6 mb-4" v-for="partner in partners" :key="partner.id">
                    <div class="partner-card text-center">
                        <img :src="partner.src" :alt="partner.name" class="img-fluid partner-logo">
                    </div>
                </div>
            </div>

            <!-- Call to action for partnership -->
            <div class="row justify-content-center mt-5">
                <div class="col-lg-8">
                    <div class="cta-section text-center p-5" style="background-color: #f9f9ff; border-radius: 10px;">
                        <h3>Devenir Partenaire ?</h3>
                        <p class="mb-4">Vous souhaitez soutenir nos actions et devenir partenaire de l'association Omnia ?</p>
                        <a href="contact.html" class="boxed-btn3">Contactez-nous</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- partners_area_end -->

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

.partner-card {
    background: #fff;
    padding: 30px 15px;
    border-radius: 8px;
    transition: all 0.3s ease;
    border: 1px solid #f0f0f0;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.partner-card:hover {
    box-shadow: 0 10px 20px rgba(0,0,0,0.05);
    transform: translateY(-5px);
    border-color: transparent;
}

.partner-logo {
    max-height: 80px;
    max-width: 100%;
    opacity: 0.8;
    transition: 0.3s;
    filter: grayscale(100%);
}

.partner-card:hover .partner-logo {
    opacity: 1;
    filter: grayscale(0%);
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