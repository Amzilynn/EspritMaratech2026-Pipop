<script setup lang="ts">
// Bureau page - team members
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
                        <h3>Notre Bureau</h3>
                        <p><router-link to="/" style="color: rgba(255,255,255,0.8); text-decoration: none;">ACCEUIL</router-link> / BUREAU</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- bradcam_area_end -->

    <!-- dirigeants_area_start -->
    <div class="our_volunteer_area section_padding">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-6">
                    <div class="section_title text-center mb-55">
                        <h3><span>Nos Dirigeants</span></h3>
                    </div>
                </div>
            </div>
            <!-- President & Vice President -->
            <div class="row justify-content-center mb-5">
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="team-card">
                        <div class="team-photo">
                            <img src="/img/volenteer/1.png" alt="Mourad Arfaoui">
                        </div>
                        <div class="team-info">
                            <h4>MOURAD ARFAOUI</h4>
                            <p>Le président</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6 mb-4">
                    <div class="team-card">
                        <div class="team-photo">
                            <img src="/img/volenteer/2.png" alt="Rachida Ben Hassine">
                        </div>
                        <div class="team-info">
                            <h4>RACHIDA BEN HASSINE</h4>
                            <p>Vice Présidente</p>
                        </div>
                    </div>
                </div>
            </div>
            <!-- Other members -->
            <div class="row justify-content-center">
                <div class="col-lg-3 col-md-6 mb-4">
                    <div class="team-card">
                        <div class="team-photo">
                            <img src="/img/volenteer/3.png" alt="Kaouther Zoghbi">
                        </div>
                        <div class="team-info">
                            <h4>KAOUTHER ZOGHBI</h4>
                            <p>Trésorière</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-4">
                    <div class="team-card">
                        <div class="team-photo">
                            <img src="/img/volenteer/1.png" alt="Ramy Khaddouma">
                        </div>
                        <div class="team-info">
                            <h4>RAMY KHADDOUMA</h4>
                            <p>Secretaire General</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-4">
                    <div class="team-card">
                        <div class="team-photo">
                            <img src="/img/volenteer/2.png" alt="Sonia Boulaabi">
                        </div>
                        <div class="team-info">
                            <h4>SONIA BOULAABI</h4>
                            <p>Ressources humaines</p>
                        </div>
                    </div>
                </div>
                <div class="col-lg-3 col-md-6 mb-4">
                    <div class="team-card">
                        <div class="team-photo">
                            <img src="/img/volenteer/3.png" alt="Khaoula Zaaibi">
                        </div>
                        <div class="team-info">
                            <h4>KHAOULA ZAAIBI</h4>
                            <p>Responsable Com</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- dirigeants_area_end -->

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

.team-card {
    text-align: center;
    transition: transform 0.3s ease;
}

.team-card:hover {
    transform: translateY(-5px);
}

.team-photo {
    width: 100%;
    overflow: hidden;
    border-radius: 4px;
    margin-bottom: 16px;
}

.team-photo img {
    width: 100%;
    height: 320px;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.team-card:hover .team-photo img {
    transform: scale(1.03);
}

.team-info h4 {
    font-size: 16px;
    font-weight: 700;
    color: #2D3436;
    margin-bottom: 4px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.team-info p {
    font-size: 14px;
    color: #636E72;
    margin: 0;
}
</style>
