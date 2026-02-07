<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import type { UserRole } from '@/stores/auth';
import { apiFetch } from '@/services/api';

const authStore = useAuthStore();
const email = ref('');
const password = ref('');
const selectedRole = ref<UserRole>('user');
const errorMsg = ref('');
const isLoading = ref(false);

const roles = [
    { value: 'user', label: 'Utilisateur' },
    { value: 'benevole', label: 'Bénévole' },
    { value: 'responsable', label: 'Responsable' },
    { value: 'admin', label: 'Administrateur' },
];

async function handleLogin() {
    errorMsg.value = '';

    if (!email.value || !password.value) {
        errorMsg.value = 'Veuillez remplir tous les champs.';
        return;
    }

    isLoading.value = true;
    try {
        const response = await apiFetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        });

        isLoading.value = false;

        // Get role directly from backend (already uppercase)
        const backendRole = response.user.role; // Don't convert to lowercase!
        
        console.log('Login response:', response);
        console.log('Backend role:', backendRole);
        
        if (backendRole.toUpperCase() === 'CITOYEN') {
            localStorage.setItem('fo_user', JSON.stringify(response.user));
            localStorage.setItem('access_token', response.access_token);
            window.location.href = 'http://localhost:5174/';
        } else {
            // Pass role as-is to auth store (it will normalize it)
            console.log('Logging in with role:', backendRole);
            authStore.login(response.user.email, backendRole);
            localStorage.setItem('access_token', response.access_token);
        }
    } catch (err: any) {
        isLoading.value = false;
        errorMsg.value = err.message || 'Identifiants invalides.';
    }
}
</script>

<template>
    <div class="auth-page">
        <div class="auth-container">
            <div class="auth-card">
                <div class="auth-header">
                    <h1 class="auth-logo">Omnia</h1>
                    <h2>Connexion</h2>
                    <p>Connectez-vous pour accéder à votre espace</p>
                </div>

                <div v-if="errorMsg" class="auth-error">
                    <i class="fa fa-exclamation-circle"></i> {{ errorMsg }}
                </div>

                <form @submit.prevent="handleLogin" class="auth-form">
                    <div class="form-group">
                        <label for="email"><i class="fa fa-envelope"></i> Adresse Email</label>
                        <input
                            id="email"
                            v-model="email"
                            type="email"
                            placeholder="votre@email.com"
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label for="password"><i class="fa fa-lock"></i> Mot de Passe</label>
                        <input
                            id="password"
                            v-model="password"
                            type="password"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div class="form-group">
                        <label for="role"><i class="fa fa-user"></i> Rôle</label>
                        <select id="role" v-model="selectedRole">
                            <option v-for="r in roles" :key="r.value" :value="r.value">{{ r.label }}</option>
                        </select>
                    </div>

                    <div class="form-options">
                        <label class="remember-me">
                            <input type="checkbox" /> Se souvenir de moi
                        </label>
                        <a href="#" class="forgot-link">Mot de passe oublié ?</a>
                    </div>

                    <button type="submit" class="auth-btn" :disabled="isLoading">
                        <span v-if="isLoading">Connexion...</span>
                        <span v-else>Se Connecter</span>
                    </button>
                </form>

                <div class="auth-footer">
                    <p>Pas encore de compte ? <router-link to="/auth/register">S'inscrire</router-link></p>
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
    max-width: 440px;
}

.auth-card {
    background: #fff;
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.auth-header {
    text-align: center;
    margin-bottom: 30px;
}

.auth-logo {
    font-size: 36px;
    font-weight: 700;
    color: #2B7EC1;
    margin-bottom: 16px;
    font-family: 'Georgia', serif;
}

.auth-header h2 {
    font-size: 24px;
    color: #2D3436;
    margin-bottom: 6px;
    font-weight: 600;
}

.auth-header p {
    color: #636E72;
    font-size: 14px;
    margin: 0;
}

.auth-error {
    background: #FFF5F5;
    color: #D32F2F;
    padding: 10px 14px;
    border-radius: 8px;
    font-size: 14px;
    margin-bottom: 20px;
    border: 1px solid #FFCDD2;
}

.auth-form .form-group {
    margin-bottom: 18px;
}

.auth-form label {
    display: block;
    font-size: 13px;
    font-weight: 600;
    color: #2D3436;
    margin-bottom: 6px;
}

.auth-form label i {
    color: #2B7EC1;
    margin-right: 6px;
    width: 14px;
}

.auth-form input[type="email"],
.auth-form input[type="password"],
.auth-form select {
    width: 100%;
    padding: 12px 14px;
    border: 2px solid #E0E0E0;
    border-radius: 8px;
    font-size: 14px;
    transition: border-color 0.3s;
    background: #FAFAFA;
    box-sizing: border-box;
}

.auth-form input:focus,
.auth-form select:focus {
    outline: none;
    border-color: #2B7EC1;
    background: #fff;
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 22px;
    font-size: 13px;
}

.remember-me {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #636E72;
    cursor: pointer;
    font-weight: 400 !important;
}

.forgot-link {
    color: #2B7EC1;
    text-decoration: none;
    font-weight: 500;
}

.forgot-link:hover {
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
    margin-top: 24px;
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
