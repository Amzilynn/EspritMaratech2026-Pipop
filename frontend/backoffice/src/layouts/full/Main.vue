<script setup lang="ts">
import { ref, shallowRef, computed } from 'vue';
import sidebarItems from './vertical-sidebar/sidebarItem';
import NavGroup from './vertical-sidebar/NavGroup/index.vue';
import NavItem from './vertical-sidebar/NavItem/index.vue';
import Logo from './logo/Logo.vue';
// Icon Imports
import { Menu2Icon, BellRingingIcon } from 'vue-tabler-icons';
import NotificationDD from './vertical-header/NotificationDD.vue';
import ProfileDD from './vertical-header/ProfileDD.vue';
import { useAuthStore } from '@/stores/auth';

const authStore = useAuthStore();
const sDrawer = ref(true);

const sidebarMenu = computed(() => {
    return sidebarItems.filter(item => {
        if (!item.roles) return true;
        if (!authStore.role) return false;
        return item.roles.includes(authStore.role);
    });
});
</script>

<template>
    <v-navigation-drawer left v-model="sDrawer" app class="leftSidebar ml-sm-5 mt-sm-5 bg-containerBg" elevation="10"
        width="270">
        <div class="pa-5 pl-4 ">
            <Logo />
        </div>
        <!-- ---------------------------------------------- -->
        <!---Navigation -->
        <!-- ---------------------------------------------- -->
        <perfect-scrollbar class="scrollnavbar bg-containerBg overflow-y-hidden">
            <v-list class="py-4 px-4 bg-containerBg">
                <!---Menu Loop -->
                <template v-for="(item, i) in sidebarMenu">
                    <!---Item Sub Header -->
                    <NavGroup :item="item" v-if="item.header" :key="item.title" />
                    <!---Single Item-->
                    <NavItem :item="item" v-else class="leftPadding" />
                    <!---End Single Item-->
                </template>
                <!-- <Moreoption/> -->
            </v-list>
            <div class="py-0 px-6">
                <!-- Upgrade button removed -->
            </div>
        </perfect-scrollbar>
    </v-navigation-drawer>
    <div class="container verticalLayout">
        <div class="maxWidth">
            <v-app-bar elevation="0" height="70" class="border-b">
                <div class="d-flex align-center justify-space-between w-100 px-4">
                    <div class="d-flex align-center">
                        <v-btn class="hidden-lg-and-up text-muted mr-2" @click="sDrawer = !sDrawer" icon
                            variant="flat" size="small">
                            <Menu2Icon size="20" stroke-width="1.5" />
                        </v-btn>
                        
                        <!-- Page Context Title (Hidden on small screens) -->
                        <div class="hidden-sm-and-down ml-4">
                            <h2 class="text-subtitle-1 font-weight-bold grey--text text--darken-2">Omnia Humanitarian OS</h2>
                        </div>
                    </div>

                    <div class="d-flex align-center gap-3">
                        <!-- Role Badge (Prominent) -->
                        <VChip 
                            :color="authStore.role === 'ADMIN' ? 'error' : (authStore.role === 'RESPONSABLE_TERRAIN' ? 'primary' : 'success')" 
                            variant="flat" 
                            size="small" 
                            class="font-weight-black text-uppercase px-4 hidden-xs"
                            rounded="pill"
                        >
                            {{ authStore.role === 'ADMIN' ? 'Administrateur' : (authStore.role === 'RESPONSABLE_TERRAIN' ? 'Responsable' : 'Bénévole') }}
                        </VChip>

                        <!-- Notification -->
                        <NotificationDD />
                        
                        <!-- User Info Vertical Stack (Hidden on mobile) -->
                        <div class="text-right mr-3 hidden-sm-and-down">
                            <div class="text-body-2 font-weight-bold line-height-tight">{{ authStore.email?.split('@')[0] }}</div>
                            <div class="text-caption text-grey opacity-70">{{ authStore.email }}</div>
                        </div>

                        <!-- User Profile -->
                        <ProfileDD />
                    </div>
                </div>
            </v-app-bar>
        </div>
    </div>
</template>
