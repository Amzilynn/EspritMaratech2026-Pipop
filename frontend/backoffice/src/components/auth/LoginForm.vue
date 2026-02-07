<script setup lang="ts">
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import type { UserRole } from '@/stores/auth';

const authStore = useAuthStore();
const username = ref('Demo User');
const selectedRole = ref<UserRole>('admin');

function handleLogin() {
    authStore.login(username.value, selectedRole.value);
}
</script>

<template>
    <div class="d-flex align-center text-center mb-6">
        <div class="text-h6 w-100 px-5 font-weight-regular auth-divider position-relative">
            <span class="bg-surface px-5 py-3 position-relative text-subtitle-1 text-grey100">Sign in to Omnia</span>
        </div>
    </div>
    <v-form @submit.prevent="handleLogin">
        <v-row class="mb-3">
            <v-col cols="12">
                <v-label class="font-weight-medium mb-1">Username</v-label>
                <v-text-field v-model="username" variant="outlined" class="pwdInput" hide-details color="primary"></v-text-field>
            </v-col>
            <v-col cols="12">
                <v-label class="font-weight-medium mb-1">Role (Demo)</v-label>
                <v-select
                    v-model="selectedRole"
                    :items="['admin', 'responsable', 'benevole']"
                    variant="outlined"
                    hide-details
                    color="primary"
                ></v-select>
            </v-col>
            <v-col cols="12">
                <v-label class="font-weight-medium mb-1">Password</v-label>
                <v-text-field variant="outlined" class="border-borderColor" type="password" hide-details
                    color="primary" value="password"></v-text-field>
            </v-col>
            <v-col cols="12 " class="py-0">
                <div class="d-flex flex-wrap align-center w-100 ">
                    <v-checkbox hide-details color="primary">
                        <template v-slot:label class="">Remember this Device</template>
                    </v-checkbox>
                </div>
            </v-col>
            <v-col cols="12">
                <v-btn size="large" rounded="pill" color="primary" class="rounded-pill" block type="submit" flat>Sign
                    In</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>
