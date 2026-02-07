<script setup lang="ts">
import { ref } from 'vue';

const contactForm = ref({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
});

const submitForm = () => {
    // In a real application, you would send this to the backend
    console.log('Form submitted:', contactForm.value);
    alert('Votre message a été envoyé !');
    contactForm.value = { firstName: '', lastName: '', email: '', message: '' };
};
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
                        <h3>CONTACT</h3>
                        <p><router-link to="/" style="color: rgba(255,255,255,0.8); text-decoration: none;">ACCUEIL</router-link> / CONTACT</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- bradcam_area_end -->

    <!-- contact_section_start -->
    <section class="contact-section">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-6">
                    <div class="section_title text-center mb-55">
                        <h3>NOUS TROUVER</h3>
                    </div>
                </div>
            </div>
            
            <div class="row info-boxes mb-5">
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="info-box">
                        <div class="icon-circle">
                            <i class="fa fa-map-marker"></i>
                        </div>
                        <h4>ADRESSE</h4>
                        <p>16 rue palestine 1002 Lafayette, Tunisia</p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="info-box">
                        <div class="icon-circle">
                            <i class="fa fa-envelope"></i>
                        </div>
                        <h4>EMAIL</h4>
                        <p><a href="mailto:omniatn.charity@gmail.com">omniatn.charity@gmail.com</a></p>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="info-box">
                        <div class="icon-circle">
                            <i class="fa fa-phone"></i>
                        </div>
                        <h4>NUMÉRO</h4>
                        <p><a href="tel:+21698534849">(+216) 98 534 849</a></p>
                    </div>
                </div>
            </div>

            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <form class="form-contact contact_form" @submit.prevent="submitForm">
                        <div class="row">
                             <div class="col-12 mb-3">
                                <label for="name" class="form-label" style="font-weight: bold; color: #555;">Nom complet <span style="color: red;">*</span></label>
                            </div>
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <input class="form-control valid" v-model="contactForm.firstName" name="firstName" id="firstName" type="text" placeholder="Prénom" required style="height: 50px; background: #fff; border: 1px solid #e5e6e9; border-radius: 5px;">
                                </div>
                            </div>
                            <div class="col-sm-6">
                                <div class="form-group">
                                    <input class="form-control valid" v-model="contactForm.lastName" name="lastName" id="lastName" type="text" placeholder="Nom" required style="height: 50px; background: #fff; border: 1px solid #e5e6e9; border-radius: 5px;">
                                </div>
                            </div>
                             <div class="col-12 mt-3 mb-2">
                                <label for="email" class="form-label" style="font-weight: bold; color: #555;">E-mail <span style="color: red;">*</span></label>
                            </div>
                            <div class="col-12">
                                <div class="form-group">
                                    <input class="form-control valid" v-model="contactForm.email" name="email" id="email" type="email" placeholder="" required style="height: 50px; background: #fff; border: 1px solid #e5e6e9; border-radius: 5px;">
                                </div>
                            </div>
                            <!-- Assuming the screenshot implies a message field or just basic registration, adding standard contact form elements just in case, but keeping it simple based on screenshot view -->
                        </div>
                        <div class="form-group mt-3 text-right"> <!-- Right align button could be standard -->
                            <!-- Screenshot cuts off, assuming a submit button exists -->
                             <button type="submit" class="boxed-btn3">Envoyer</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </section>
    <!-- contact_section_end -->

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

.section_title h3 {
    font-size: 36px;
    font-weight: 700;
    color: #2D3436;
    margin-bottom: 50px;
}

.info-box {
    background-color: #1A1A1A; /* Dark background matching screenshot */
    color: white;
    padding: 40px 20px;
    text-align: center;
    border-radius: 4px;
    height: 100%;
    transition: 0.3s;
}

.info-box:hover {
    transform: translateY(-5px);
}

.icon-circle {
    width: 60px;
    height: 60px;
    background-color: var(--primary-blue, #2B7EC1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px;
    font-size: 24px;
}

.info-box h4 {
    color: white;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 15px;
    text-transform: uppercase;
}

.info-box p {
    color: #ccc;
    font-size: 15px;
    margin-bottom: 0;
}

.info-box p a {
    color: #ccc;
}

.info-box p a:hover {
    color: var(--primary-blue, #2B7EC1);
}

.info-boxes {
    margin-bottom: 80px;
}

.contact_form {
    padding: 0;
}

.contact_form .form-group {
    margin-bottom: 15px;
}

.boxed-btn3 {
    background: var(--primary-blue, #2B7EC1);
    color: #fff;
    display: inline-block;
    padding: 13px 29px;
    font-family: "Roboto", sans-serif;
    font-size: 16px;
    font-weight: 500;
    border: 0;
    cursor: pointer;
    text-transform: uppercase;
    border-radius: 5px;
}
</style>