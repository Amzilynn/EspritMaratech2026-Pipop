import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

// Backend uses uppercase: ADMIN, RESPONSABLE_TERRAIN, BENEVOLE, CITOYEN
export type UserRole = 'ADMIN' | 'RESPONSABLE_TERRAIN' | 'BENEVOLE' | 'CITOYEN';

// Helper to normalize role from backend
function normalizeRole(backendRole: string): UserRole {
    const upper = backendRole.toUpperCase();
    // Map old lowercase values to new uppercase
    if (upper === 'ADMIN') return 'ADMIN';
    if (upper === 'RESPONSABLE' || upper === 'RESPONSABLE_TERRAIN') return 'RESPONSABLE_TERRAIN';
    if (upper === 'BENEVOLE') return 'BENEVOLE';
    if (upper === 'USER' || upper === 'CITOYEN') return 'CITOYEN';
    return upper as UserRole;
}

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();
    const email = ref<string | null>(localStorage.getItem('user_email'));
    const storedRole = localStorage.getItem('role');
    const role = ref<UserRole | null>(storedRole ? normalizeRole(storedRole) : null);

    const isAuthenticated = computed(() => !!email.value);

    // Keep backward compat: also check old 'user' key
    if (!email.value && localStorage.getItem('user')) {
        email.value = localStorage.getItem('user');
    }

    function login(userEmail: string, userRole: string) {
        email.value = userEmail;
        const normalized = normalizeRole(userRole);
        role.value = normalized;
        localStorage.setItem('user_email', userEmail);
        localStorage.setItem('role', normalized);
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
        localStorage.removeItem('access_token');
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
