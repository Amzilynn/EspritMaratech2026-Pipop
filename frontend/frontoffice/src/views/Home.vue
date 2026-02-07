<script setup lang="ts">
// Home page
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

    <!-- slider_area_start -->
    <div class="slider_area">
        <div class="single_slider d-flex align-items-center slider_bg_1 overlay2">
            <div class="container">
                <div class="row">
                    <div class="col-lg-9">
                        <div class="slider_text">
                            <h3>JOINDRE LA SYMPATHIE AU SOUTIEN <br> FINANCIER ET MORAL</h3>
                            <p>Omnia est une Association humanitaire à but non lucratif régie par la loi de 2011,<br>
                                née de la volonté de jeunes Tunisiens désirant réaliser des missions humanitaires.</p>
                            <a href="About.html" class="boxed-btn3">En Savoir Plus</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- slider_area_end -->

    <!-- reson_area_start -->
    <div class="reson_area section_padding">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-6">
                    <div class="section_title text-center mb-55">
                        <h3><span>Notre Cause</span></h3>
                    </div>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-4 col-md-6">
                    <div class="single_reson">
                        <div class="thum">
                            <div class="thum_1">
                                <img src="/img/help/1.png" alt="">
                            </div>
                        </div>
                        <div class="help_content">
                            <h4>Porter Assistance aux Personnes Défavorisées</h4>
                            <p>Nous nous engageons à apporter un soutien concret aux personnes dans le besoin à travers diverses actions humanitaires.</p>
                            <a href="#" class="read_more">En Savoir Plus</a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6">
                    <div class="single_reson">
                        <div class="thum">
                            <div class="thum_1">
                                <img src="/img/help/2.png" alt="">
                            </div>
                        </div>
                        <div class="help_content">
                            <h4>Porter Assistance aux Personnes Âgées</h4>
                            <p>Un accompagnement attentif et respectueux pour nos aînés, car chaque personne mérite dignité et soutien.</p>
                            <a href="#" class="read_more">En Savoir Plus</a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6">
                    <div class="single_reson">
                        <div class="thum">
                            <div class="thum_1">
                                <img src="/img/help/3.png" alt="">
                            </div>
                        </div>
                        <div class="help_content">
                            <h4>Porter Assistance aux Personnes à Mobilité Réduite</h4>
                            <p>Nous œuvrons pour faciliter le quotidien des personnes en situation de handicap avec compassion et engagement.</p>
                            <a href="#" class="read_more">En Savoir Plus</a>
                        </div>
                    </div>
                </div>
                <div class="col-lg-4 col-md-6">
                    <div class="single_reson">
                        <div class="thum">
                            <div class="thum_1">
                                <img src="/img/help/3.png" alt="">
                            </div>
                        </div>
                        <div class="help_content">
                            <h4>Contribution au Travail Social</h4>
                            <p>Ensemble, nous bâtissons une société plus solidaire par des actions concrètes et un engagement durable.</p>
                            <a href="#" class="read_more">En Savoir Plus</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- reson_area_end -->

    <!-- latest_activites_area_start -->
    <div class="latest_activites_area">
        <div class="video_bg_1 video_activite d-flex align-items-center justify-content-center">
            <a class="popup-video" href="https://www.youtube.com/watch?v=MG3jGHnBVQs">
                <i class="flaticon-ui"></i>
            </a>
        </div>
        <div class="container">
            <div class="row justify-content-end">
                <div class="col-lg-7">
                    <div class="activites_info">
                        <div class="section_title">
                            <h3><span>À Propos de Nous</span></h3>
                        </div>
                        <p class="para_1">Omnia est une Association humanitaire à but non lucratif régie par la loi de 2011, née de la volonté de jeunes Tunisiens désirant réaliser des missions humanitaires.</p>
                        <p class="para_2">Notre mission est d'apporter soutien et assistance aux personnes dans le besoin, qu'il s'agisse de personnes défavorisées, âgées ou à mobilité réduite. Nous croyons fermement qu'on ne peut applaudir d'une seule main, et c'est pourquoi nous joignons la sympathie et l'affection au soutien financier et moral.</p>
                        <a href="#" data-scroll-nav='1' class="boxed-btn4">Faire un Don</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- latest_activites_area_end -->

    <!-- counter_area_start -->
    <div class="counter_area">
        <div class="container">
            <div class="counter_bg overlay">
                <div class="row">
                    <div class="col-lg-3 col-md-6">
                        <div class="single_counter d-flex align-items-center justify-content-center">
                            <div class="icon">
                                <i class="flaticon-calendar"></i>
                            </div>
                            <div class="events">
                                <h3 class="counter">95</h3>
                                <p>Actions</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <div class="single_counter d-flex align-items-center justify-content-center">
                            <div class="icon">
                                <i class="flaticon-heart-beat"></i>
                            </div>
                            <div class="events">
                                <h3 class="counter">34</h3>
                                <p>Membres</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <div class="single_counter d-flex align-items-center justify-content-center">
                            <div class="icon">
                                <i class="flaticon-in-love"></i>
                            </div>
                            <div class="events">
                                <h3 class="counter">2000</h3>
                                <p>Personnes Aidées</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <div class="single_counter d-flex align-items-center justify-content-center">
                            <div class="icon">
                                <i class="flaticon-hug"></i>
                            </div>
                            <div class="events">
                                <h3 class="counter">4</h3>
                                <p>Années d'Expérience</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- counter_area_end -->

    <!-- popular_causes_area_start -->
    <div class="popular_causes_area section_padding">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-6">
                    <div class="section_title text-center mb-55">
                        <h3><span>Dernières Actions</span></h3>
                        <p>Juger de vous même</p>
                    </div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-12">
                    <div class="causes_active owl-carousel">
                        <div class="single_cause">
                            <div class="thumb">
                                <img src="/img/causes/1.png" alt="">
                            </div>
                            <div class="causes_content">
                                <div class="custom_progress_bar">
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar" style="width: 70%;" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100">
                                            <span class="progres_count">70%</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="balance d-flex justify-content-between align-items-center">
                                    <span>Collecté: 3500 DT</span>
                                    <span>Objectif: 5000 DT</span>
                                </div>
                                <h4>Hiver au Chaud 3.0</h4>
                                <p>Distribution de vêtements chauds et de couvertures aux personnes dans le besoin durant la saison hivernale.</p>
                                <a class="read_more" href="cause_details.html">En Savoir Plus</a>
                            </div>
                        </div>
                        <div class="single_cause">
                            <div class="thumb">
                                <img src="/img/causes/2.png" alt="">
                            </div>
                            <div class="causes_content">
                                <div class="custom_progress_bar">
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar" style="width: 85%;" aria-valuenow="85" aria-valuemin="0" aria-valuemax="100">
                                            <span class="progres_count">85%</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="balance d-flex justify-content-between align-items-center">
                                    <span>Collecté: 4250 DT</span>
                                    <span>Objectif: 5000 DT</span>
                                </div>
                                <h4>Aide Alimentaire</h4>
                                <p>Distribution de colis alimentaires aux familles nécessiteuses pour assurer leur sécurité alimentaire.</p>
                                <a class="read_more" href="cause_details.html">En Savoir Plus</a>
                            </div>
                        </div>
                        <div class="single_cause">
                            <div class="thumb">
                                <img src="/img/causes/3.png" alt="">
                            </div>
                            <div class="causes_content">
                                <div class="custom_progress_bar">
                                    <div class="progress">
                                        <div class="progress-bar" role="progressbar" style="width: 60%;" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100">
                                            <span class="progres_count">60%</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="balance d-flex justify-content-between align-items-center">
                                    <span>Collecté: 3000 DT</span>
                                    <span>Objectif: 5000 DT</span>
                                </div>
                                <h4>Soutien Scolaire</h4>
                                <p>Fourniture de matériel scolaire et soutien éducatif pour les enfants défavorisés.</p>
                                <a class="read_more" href="cause_details.html">En Savoir Plus</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- popular_causes_area_end -->

    <!-- our_volunteer_area_start (Partners) -->
    <div class="our_volunteer_area section_padding">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-6">
                    <div class="section_title text-center mb-55">
                        <h3><span>Nos Partenaires</span></h3>
                    </div>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-12">
                    <div class="partner_logos d-flex justify-content-around align-items-center flex-wrap">
                        <div class="partner_item m-3">
                            <img src="https://placehold.co/150x80?text=Digital+Natives" alt="Digital Natives" style="height: 80px;">
                        </div>
                        <div class="partner_item m-3">
                            <img src="https://placehold.co/150x80?text=Natilait" alt="Natilait" style="height: 80px;">
                        </div>
                        <div class="partner_item m-3">
                            <img src="https://placehold.co/150x80?text=Baby+Motif" alt="Baby Motif" style="height: 80px;">
                        </div>
                        <div class="partner_item m-3">
                            <img src="https://placehold.co/150x80?text=Koukou+Kafe" alt="Koukou Kafe" style="height: 80px;">
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- our_volunteer_area_end -->

    <!-- testimonials_area_start -->
    <div class="testimonials_area section_padding">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-6">
                    <div class="section_title text-center mb-55">
                        <h3><span>Témoignages</span></h3>
                    </div>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <div class="testimonial_content text-center">
                        <div class="quote_icon mb-4">
                            <i class="fa fa-quote-left" style="font-size: 48px; color: var(--primary-blue);"></i>
                        </div>
                        <p style="font-size: 18px; font-style: italic; margin-bottom: 20px;">
                            Je fais confiance à Omnia pour faire un don !
                        </p>
                        <div class="author_info">
                            <img src="https://placehold.co/60x60?text=User" alt="" style="width: 60px; height: 60px; border-radius: 50%; margin-bottom: 10px;">
                            <h5 style="color: var(--primary-blue); margin-bottom: 0;">ANIS BEN BECHIR</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- testimonials_area_end -->

    <!-- donation_area_start -->
    <div data-scroll-index='1' class="make_donation_area section_padding">
        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-6">
                    <div class="section_title text-center mb-55">
                        <h3><span>Faire un Don</span></h3>
                    </div>
                </div>
            </div>
            <div class="row justify-content-center">
                <div class="col-lg-6">
                    <form action="#" class="donation_form">
                        <div class="row align-items-center">
                            <div class="col-md-4">
                                <div class="single_amount">
                                    <div class="input_field">
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                                <span class="input-group-text" id="basic-addon1">DT</span>
                                            </div>
                                            <input type="text" class="form-control" placeholder="50" aria-label="Amount" aria-describedby="basic-addon1">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-8">
                                <div class="single_amount">
                                    <div class="fixed_donat d-flex align-items-center justify-content-between">
                                        <div class="select_prise">
                                            <h4>Montant:</h4>
                                        </div>
                                        <div class="single_doonate">
                                            <input type="radio" id="blns_1" name="radio-group" checked>
                                            <label for="blns_1">20 DT</label>
                                        </div>
                                        <div class="single_doonate">
                                            <input type="radio" id="blns_2" name="radio-group">
                                            <label for="blns_2">50 DT</label>
                                        </div>
                                        <div class="single_doonate">
                                            <input type="radio" id="Other" name="radio-group">
                                            <label for="Other">Autre</label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="donate_now_btn text-center">
                        <a href="#" class="boxed-btn4">Faire un Don Maintenant</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- donation_area_end -->

    <!-- footer_start -->
    <footer class="footer">
        <div class="footer_top">
            <div class="container">
                <div class="row">
                    <div class="col-xl-4 col-md-6 col-lg-4">
                        <div class="footer_widget">
                            <div class="footer_logo mb-35">
                                <a href="index.html" style="font-size: 28px; font-weight: 700; color: white; text-decoration: none;">
                                    Omnia
                                </a>
                            </div>
                            <p class="address_text">
                                Omnia est une association humanitaire dédiée à l'aide aux plus démunis,
                                en apportant soutien moral, financier et assistance directe.
                            </p>
                            <div class="socail_links">
                                <ul>
                                    <li><a href="#"><i class="ti-facebook"></i></a></li>
                                    <li><a href="#"><i class="fa fa-instagram"></i></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-2 col-md-6 col-lg-2">
                        <div class="footer_widget">
                            <h3 class="footer_title">Site Map</h3>
                            <ul class="links">
                                <li><a href="#">Accueil</a></li>
                                <li><a href="#">Bureau</a></li>
                                <li><a href="#">Action</a></li>
                                <li><router-link to="/donate">Faire un don</router-link></li>
                                <li><a href="#">Nous Rejoindre</a></li>
                                <li><a href="#">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 col-lg-3">
                        <div class="footer_widget">
                            <h3 class="footer_title">Contacts</h3>
                            <div class="contacts">
                                <p>(+216) 98 534 849<br>
                                    omniatn.charity@gmail.com<br>
                                    16 rue palestine 1002 Lafayette, Tunisia
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class="col-xl-3 col-md-6 col-lg-3">
                        <div class="footer_widget">
                            <h3 class="footer_title">Newsletter</h3>
                            <p>Abonnez vous à notre newsletter pour suivre nos actions.</p>
                            <form action="#" class="newsletter_form">
                                <input type="email" placeholder="Votre e-mail" style="width: 100%; padding: 10px; margin-bottom: 10px; border: 1px solid rgba(255,255,255,0.2); background: rgba(255,255,255,0.1); color: white; border-radius: 4px;">
                                <button type="submit" style="width: 100%; padding: 10px; background: var(--accent-gold, #F5A623); color: white; border: none; cursor: pointer; border-radius: 4px; font-weight: 600;">S'abonner</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="copy-right_text">
            <div class="container">
                <div class="row">
                    <div class="bordered_1px"></div>
                    <div class="col-xl-12">
                        <p class="copy_right text-center">
                            Copyright &copy; {{ new Date().getFullYear() }} Association Omnia | Tous droits réservés
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </footer>
    <!-- footer_end -->
</template>

<style scoped>
.slider_bg_1 {
    background-image: url(/img/banner/banner.png);
}
.video_bg_1 {
    background-image: url(/img/banner/banner.png);
}
</style>
