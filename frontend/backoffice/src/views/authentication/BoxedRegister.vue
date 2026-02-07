<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { apiFetch } from '@/services/api';

const router = useRouter();

const form = ref({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
});

const errorMsg = ref('');
const successMsg = ref('');
const isLoading = ref(false);

async function handleRegister() {
    errorMsg.value = '';
    successMsg.value = '';

    if (!form.value.firstName || !form.value.lastName || !form.value.email || !form.value.password) {
        errorMsg.value = 'Veuillez remplir tous les champs obligatoires.';
        return;
    }

    if (form.value.password.length < 6) {
        errorMsg.value = 'Le mot de passe doit contenir au moins 6 caractères.';
        return;
    }

    if (form.value.password !== form.value.confirmPassword) {
        errorMsg.value = 'Les mots de passe ne correspondent pas.';
        return;
    }

    isLoading.value = true;
    try {
        const response = await apiFetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email: form.value.email,
                password: form.value.password,
                lastName: form.value.lastName,
                firstName: form.value.firstName,
                telephone: form.value.phone,
                roleName: 'CITOYEN' // Mandatory role for public registration
            })
        });

        isLoading.value = false;
        successMsg.value = 'Compte créé avec succès ! Redirection vers la connexion...';

        setTimeout(() => {
            router.push('/auth/login');
        }, 2000);
    } catch (err: any) {
        isLoading.value = false;
        errorMsg.value = err.message || 'Une erreur est survenue lors de la création du compte.';
    }
}
</script>

<template>
    <div class="auth-page">
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-header">
                    <h1 class="auth-logo">Omnia</h1>
                    <h2>Créer un Compte</h2>
                    <p>Rejoignez notre communauté et participez à nos actions</p>
                </div>

                <div v-if="errorMsg" class="auth-error">
                    <i class="fa fa-exclamation-circle"></i> {{ errorMsg }}
                </div>

                <div v-if="successMsg" class="auth-success">
                    <i class="fa fa-check-circle"></i> {{ successMsg }}
                </div>

                <form @submit.prevent="handleRegister" class="auth-form">
                    <div class="form-row">
                        <div class="form-group half">
                            <label for="firstName"><i class="fa fa-user"></i> Prénom *</label>
                            <input id="firstName" v-model="form.firstName" type="text" placeholder="Votre prénom" required />
                        </div>
                        <div class="form-group half">
                            <label for="lastName">Nom *</label>
                            <input id="lastName" v-model="form.lastName" type="text" placeholder="Votre nom" required />
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="email"><i class="fa fa-envelope"></i> Adresse Email *</label>
                        <input id="email" v-model="form.email" type="email" placeholder="votre@email.com" required />
                    </div>

                    <div class="form-group">
                        <label for="phone"><i class="fa fa-phone"></i> Téléphone</label>
                        <input id="phone" v-model="form.phone" type="tel" placeholder="+216 XX XXX XXX" />
                    </div>

                    <div class="form-row">
                        <div class="form-group half">
                            <label for="password"><i class="fa fa-lock"></i> Mot de Passe *</label>
                            <input id="password" v-model="form.password" type="password" placeholder="Min. 6 caractères" required />
                        </div>
                        <div class="form-group half">
                            <label for="confirmPassword">Confirmer *</label>
                            <input id="confirmPassword" v-model="form.confirmPassword" type="password" placeholder="Confirmer" required />
                        </div>
                    </div>

                    <div class="role-info">
                        <i class="fa fa-info-circle"></i>
                        Votre compte sera créé avec le rôle <strong>Citoyen</strong>.
                    </div>

                    <div class="form-terms">
                        <label>
                            <input type="checkbox" required />
                            J'accepte les <a href="#">conditions d'utilisation</a> et la <a href="#">politique de confidentialité</a>
                        </label>
                    </div>

                    <button type="submit" class="auth-btn" :disabled="isLoading">
                        <span v-if="isLoading">Création en cours...</span>
                        <span v-else>Créer mon Compte</span>
                    </button>
                </form>

                <div class="auth-footer">
                    <p>Déjà un compte ? <router-link to="/auth/login">Se Connecter</router-link></p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.auth-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #1E5A8E 0%, #2B7EC1 50%, #5FA3D8 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    font-family: 'Roboto', 'Inter', sans-serif;
}

.auth-container {
    width: 100%;
    max-width: 500px;
}

.auth-card {
    background: #fff;
    border-radius: 16px;
    padding: 36px 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.auth-header {
    text-align: center;
    margin-bottom: 26px;
}

.auth-logo {
    font-size: 36px;
    font-weight: 700;
    color: #2B7EC1;
    margin-bottom: 12px;
    font-family: 'Georgia', serif;
}

.auth-header h2 {
    font-size: 22px;
    color: #2D3436;
    margin-bottom: 6px;
    font-weight: 600;
}

.auth-header p {
    color: #636E72;
    font-size: 13px;
    margin: 0;
}

.auth-error {
    background: #FFF5F5;
    color: #D32F2F;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 14px;
    margin-bottom: 18px;
    border: 1px solid #FFCDD2;
}

.auth-success {
    background: #F0FFF4;
    color: #2E7D32;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 14px;
    margin-bottom: 18px;
    border: 1px solid #C8E6C9;
}

.form-row {
    display: flex;
    gap: 14px;
}

.form-group {
    margin-bottom: 16px;
}

.form-group.half {
    flex: 1;
}

.auth-form label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #2D3436;
    margin-bottom: 5px;
}

.auth-form label i {
    color: #2B7EC1;
    margin-right: 5px;
    width: 14px;
}

.auth-form input[type="email"],
.auth-form input[type="password"],
.auth-form input[type="text"],
.auth-form input[type="tel"] {
    width: 100%;
    padding: 11px 14px;
    border: 2px solid #E0E0E0;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s;
    background: #FAFAFA;
    box-sizing: border-box;
}

.auth-form input:focus {
    outline: none;
    border-color: #2B7EC1;
    background: #fff;
}

.role-info {
    background: #E8F4FD;
    color: #1E5A8E;
    padding: 12px 14px;
    border-radius: 8px;
    font-size: 13px;
    margin-bottom: 16px;
    line-height: 1.5;
}

.role-info i {
    margin-right: 6px;
}

.form-terms {
    margin-bottom: 20px;
    font-size: 13px;
    color: #636E72;
}

.form-terms label {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-weight: 400 !important;
    cursor: pointer;
}

.form-terms a {
    color: #2B7EC1;
    text-decoration: none;
}

.form-terms a:hover {
    text-decoration: underline;
}

.auth-btn {
    width: 100%;
    padding: 13px;
    background: linear-gradient(135deg, #2B7EC1, #1E5A8E);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.auth-btn:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(43, 126, 193, 0.4);
}

.auth-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.auth-footer {
    text-align: center;
    margin-top: 20px;
    font-size: 14px;
    color: #636E72;
}

.auth-footer a {
    color: #2B7EC1;
    font-weight: 600;
    text-decoration: none;
}

.auth-footer a:hover {
    text-decoration: underline;
}
</style>
