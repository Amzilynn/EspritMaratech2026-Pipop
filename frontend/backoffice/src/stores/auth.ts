import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export type UserRole = 'admin' | 'responsable' | 'benevole' | 'user';

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();
    const email = ref<string | null>(localStorage.getItem('user_email'));
    const role = ref<UserRole | null>((localStorage.getItem('role') as UserRole) || null);

    const isAuthenticated = computed(() => !!email.value);

    // Keep backward compat: also check old 'user' key
    if (!email.value && localStorage.getItem('user')) {
        email.value = localStorage.getItem('user');
    }

    function login(userEmail: string, userRole: UserRole) {
        email.value = userEmail;
        role.value = userRole;
        localStorage.setItem('user_email', userEmail);
        localStorage.setItem('role', userRole);
        // Keep old key for compatibility
        localStorage.setItem('user', userEmail);
        router.push('/');
    }

    function logout() {
        email.value = null;
        role.value = null;
        localStorage.removeItem('user_email');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        router.push('/auth/login');
    }

    return {
        email,
        role,
        isAuthenticated,
        login,
        logout
    };
});
