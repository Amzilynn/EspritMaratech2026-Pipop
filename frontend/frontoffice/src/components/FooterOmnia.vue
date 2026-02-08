<script setup lang="ts">
import { useVoiceAssistant } from '@/composables/useVoiceAssistant'

const { speak, stopSpeaking } = useVoiceAssistant()

const onHoverFooter = () => speak("Pied de page. Retrouvez nos liens, contacts et inscrivez-vous à notre newsletter.", 'footer')
const onHoverNav = (name: string) => speak(`Lien vers ${name}.`, 'footer-nav-' + name)
</script>

<template>
    <footer class="footer-omnia" role="contentinfo" @mouseenter="onHoverFooter" @mouseleave="stopSpeaking">
        <div class="footer-top">
            <div class="container-omnia">
                <div class="footer-grid">
                    <!-- About Widget -->
                    <div class="footer-widget">
                        <div class="footer-logo">Omnia</div>
                        <p class="about-text">
                            Omnia est une Association humanitaire à but non lucratif régie par la loi de 2011,
                            née de la volonté de jeunes Tunisiens désirant réaliser des missions humanitaires.
                        </p>
                        <div class="social-icons" aria-label="Suivez-nous">
                            <a href="#" aria-label="Facebook"><i class="fa fa-facebook"></i></a>
                            <a href="#" aria-label="Instagram"><i class="fa fa-instagram"></i></a>
                            <a href="#" aria-label="LinkedIn"><i class="fa fa-linkedin"></i></a>
                        </div>
                    </div>

                    <!-- Sitemap Widget -->
                    <div class="footer-widget">
                        <h3 class="widget-title">PLAN DU SITE</h3>
                        <nav aria-label="Liens rapides footer">
                            <ul class="footer-links">
                                <li><router-link to="/" @mouseenter="onHoverNav('Accueil')" @mouseleave="stopSpeaking">Accueil</router-link></li>
                                <li><router-link to="/bureau" @mouseenter="onHoverNav('Bureau')" @mouseleave="stopSpeaking">Bureau</router-link></li>
                                <li><router-link to="/actions" @mouseenter="onHoverNav('Actions')" @mouseleave="stopSpeaking">Actions</router-link></li>
                                <li><router-link to="/galerie" @mouseenter="onHoverNav('Galerie')" @mouseleave="stopSpeaking">Galerie</router-link></li>
                                <li><router-link to="/partners" @mouseenter="onHoverNav('Partenaires')" @mouseleave="stopSpeaking">Nos Partenaires</router-link></li>
                                <li><router-link to="/donate" @mouseenter="onHoverNav('Faire un don')" @mouseleave="stopSpeaking">Faire un don</router-link></li>
                            </ul>
                        </nav>
                    </div>

                    <!-- Contact Widget -->
                    <div class="footer-widget">
                        <h3 class="widget-title">CONTACTS</h3>
                        <div class="contact-info">
                            <p><i class="fa fa-phone"></i> (+216) 98 534 849</p>
                            <p><i class="fa fa-envelope"></i> omniatn.charity@gmail.com</p>
                            <p><i class="fa fa-map-marker"></i> 16 rue palestine, 1002 Lafayette, Tunisie</p>
                        </div>
                    </div>

                    <!-- Newsletter Widget -->
                    <div class="footer-widget">
                        <h3 class="widget-title">NEWSLETTER</h3>
                        <p class="newsletter-text">Restez informé de nos dernières actions humanitaires.</p>
                        <form class="newsletter-form" aria-label="Inscription newsletter">
                            <div class="form-group-omnia">
                                <label for="footer-email" class="sr-only">Votre adresse e-mail</label>
                                <input 
                                    type="email" 
                                    id="footer-email" 
                                    class="footer-input" 
                                    placeholder="votre@email.com"
                                    required
                                />
                            </div>
                            <button type="submit" class="footer-submit btn-accent">
                                S'ABONNER
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="footer-bottom">
            <div class="container-omnia">
                <div class="copyright text-center">
                    <p>Copyright &copy; {{ new Date().getFullYear() }} Association Omnia. Tous droits réservés.</p>
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped>
.footer-omnia {
    background-color: var(--dark-blue);
    color: white;
}

.footer-top {
    padding: var(--spacing-xxl) 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
}

.footer-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: var(--spacing-xl);
}

.footer-logo {
    font-size: 32px;
    font-weight: 800;
    color: white;
    margin-bottom: var(--spacing-md);
}

.about-text {
    color: rgba(255,255,255,0.9);
    font-size: 17px;
    margin-bottom: var(--spacing-lg);
}

.social-icons {
    display: flex;
    gap: 12px;
}

.social-icons a {
    width: 36px;
    height: 36px;
    background: rgba(255,255,255,0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-decoration: none;
    transition: all 0.2s;
}

.social-icons a:hover {
    background: var(--accent-gold);
    transform: translateY(-3px);
}

.widget-title {
    color: var(--accent-gold);
    font-size: 18px;
    font-weight: 700;
    margin-bottom: var(--spacing-lg);
    position: relative;
    padding-bottom: var(--spacing-sm);
}

.widget-title::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 40px;
    height: 3px;
    background: var(--primary-blue);
}

.footer-links {
    list-style: none;
    padding: 0;
    margin: 0;
}

.footer-links li {
    margin-bottom: var(--spacing-sm);
}

.footer-links a {
    color: rgba(255,255,255,0.9);
    text-decoration: none;
    transition: all 0.2s;
}

.footer-links a:hover {
    color: var(--accent-gold);
    padding-left: 5px;
}

.contact-info p {
    color: rgba(255,255,255,0.9);
    margin-bottom: var(--spacing-sm);
    display: flex;
    align-items: flex-start;
    gap: 12px;
}

.contact-info i {
    color: var(--accent-gold);
    margin-top: 4px;
}

.newsletter-text {
    color: rgba(255,255,255,0.7);
    margin-bottom: var(--spacing-md);
}

.footer-input {
    width: 100%;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.2);
    padding: 12px;
    border-radius: 6px;
    color: white;
    margin-bottom: var(--spacing-sm);
}

.footer-submit {
    width: 100%;
    padding: 12px;
    border: none;
    border-radius: 6px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s;
}

.footer-submit:hover {
    background: var(--white);
    color: var(--accent-gold);
}

.footer-bottom {
    padding: var(--spacing-lg) 0;
    background-color: rgba(0,0,0,0.2);
}

.copyright p {
    color: rgba(255,255,255,0.5);
    margin: 0;
    font-size: 14px;
}
</style>
