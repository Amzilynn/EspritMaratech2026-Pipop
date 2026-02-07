import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

export type UserRole = 'admin' | 'responsable' | 'benevole';

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();
    const user = ref<string | null>(localStorage.getItem('user'));
    const role = ref<UserRole | null>((localStorage.getItem('role') as UserRole) || null);

    const isAuthenticated = computed(() => !!user.value);

    function login(username: string, userRole: UserRole) {
        user.value = username;
        role.value = userRole;
        localStorage.setItem('user', username);
        localStorage.setItem('role', userRole);
        router.push('/');
    }

    function logout() {
        user.value = null;
        role.value = null;
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        router.push('/auth/login');
    }

    return {
        user,
        role,
        isAuthenticated,
        login,
        logout
    };
});
