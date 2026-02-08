import { defineStore } from 'pinia';
import { ref } from 'vue';
import { apiFetch } from '@/services/api';

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role?: {
        name: string;
    };
    responsable?: {
        id: number;
        firstName: string;
        lastName: string;
    };
    responsableId?: number | null;
}

export const useUserStore = defineStore('user', () => {
    // State
    const users = ref<User[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // Actions
    async function fetchUsers(role?: string) {
        loading.value = true;
        error.value = null;
        try {
            // Ideally backend supports query params.
            // If not, we fetch all and filter client side (fallback).
            // Current investigation suggests backend fetches all, so we can filter here or there.
            // Let's try to query if possible, or fetch all.
            // Based on previous code: apiFetch('/users')

            const data = await apiFetch('/users');

            if (role) {
                users.value = data.filter((u: any) => u.role?.name === role);
            } else {
                users.value = data;
            }
        } catch (err: any) {
            console.error('Failed to fetch users:', err);
            error.value = err.message || 'Failed to fetch users';
        } finally {
            loading.value = false;
        }
    }

    // Helper to get users by role from the store state (if we fetched all)
    // Or we can simple store filtered lists.
    // For simplicity, let's keep it simple: we fetch what we need when the component mounts.
    // BUT we need Responsables list FOR the Benevoles form even when we are listing Benevoles.

    // So better approach:
    // fetchAllUsers() -> stores in `allUsers`
    // getters -> `benevoles`, `responsables`

    const allUsers = ref<User[]>([]);

    async function fetchAllUsers() {
        loading.value = true;
        error.value = null;
        try {
            const data = await apiFetch('/users');
            allUsers.value = data;
        } catch (err: any) {
            error.value = err.message;
        } finally {
            loading.value = false;
        }
    }

    async function createUser(userData: Partial<User> & { password?: string, roleName: string }) {
        loading.value = true;
        try {
            const newUser = await apiFetch('/users', {
                method: 'POST',
                body: JSON.stringify(userData),
            });
            // Update local state
            allUsers.value.push(newUser);
            return newUser;
        } catch (err: any) {
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function updateUser(id: number, userData: Partial<User> & { password?: string }) {
        loading.value = true;
        try {
            await apiFetch(`/users/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(userData),
            });
            // Update local state
            const index = allUsers.value.findIndex(u => u.id === id);
            if (index !== -1) {
                allUsers.value[index] = { ...allUsers.value[index], ...userData };
                // Creating a simplified update for the table view validity
                // If specific fields like 'responsable' object are needed, simple spread might not suffice if backend doesn't return full object on PATCH.
                // But usually we just need to update the entry.
                // If we changed responsible, we might need to refresh or manually link the object from existing users.
            }
        } catch (err: any) {
            throw err;
        } finally {
            loading.value = false;
        }
    }

    async function deleteUser(id: number) {
        loading.value = true;
        try {
            await apiFetch(`/users/${id}`, { method: 'DELETE' });
            allUsers.value = allUsers.value.filter(u => u.id !== id);
        } catch (err: any) {
            throw err;
        } finally {
            loading.value = false;
        }
    }

    return {
        allUsers,
        loading,
        error,
        fetchAllUsers,
        createUser,
        updateUser,
        deleteUser
    };
});
