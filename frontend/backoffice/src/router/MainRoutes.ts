const MainRoutes = {
    path: '/main',
    meta: {
        requiresAuth: true
    },
    redirect: '/main',
    component: () => import('@/layouts/full/FullLayout.vue'),
    children: [
        {
            name: 'Dashboard',
            path: '/',
            component: () => import('@/views/dashboard/index.vue')
        },
        {
            name: 'Alert',
            path: '/ui/alerts',
            component: () => import('@/views/ui-components/Alerts.vue')
        },
        {
            name: 'Buttons',
            path: '/ui/buttons',
            component: () => import('@/views/ui-components/Buttons.vue')
        },
        {
            name: 'Cards',
            path: '/ui/cards',
            component: () => import('@/views/ui-components/Cards.vue')
        },
        {
            name: 'Tables',
            path: '/ui/tables',
            component: () => import('@/views/ui-components/Tables.vue')
        },
        {
            name: 'Icons',
            path: '/icons',
            component: () => import('@/views/pages/Icons.vue')
        },
        {
            name: 'Starter',
            path: '/sample-page',
            component: () => import('@/views/pages/SamplePage.vue')
        },
        {
            name: 'Beneficiaries',
            path: '/beneficiaries',
            component: () => import('@/views/beneficiaries/BeneficiariesList.vue')
        },
        {
            name: 'NewBeneficiary',
            path: '/beneficiaries/new',
            component: () => import('@/views/beneficiaries/BeneficiaryForm.vue')
        },
        {
            name: 'EditBeneficiary',
            path: '/beneficiaries/edit/:id',
            component: () => import('@/views/beneficiaries/BeneficiaryForm.vue')
        },
        // Users
        { path: '/users', name: 'Users', component: () => import('@/views/users/UsersList.vue') },
        { path: '/users/new', name: 'NewUser', component: () => import('@/views/users/UserForm.vue') },
        { path: '/users/edit/:id', name: 'EditUser', component: () => import('@/views/users/UserForm.vue') },
        // Roles
        { path: '/roles', name: 'Roles', component: () => import('@/views/roles/RolesList.vue') },
        { path: '/roles/new', name: 'NewRole', component: () => import('@/views/roles/RoleForm.vue') },
        { path: '/roles/edit/:id', name: 'EditRole', component: () => import('@/views/roles/RoleForm.vue') },
        // Visits
        { path: '/visits', name: 'Visits', component: () => import('@/views/visits/VisitsList.vue') },
        { path: '/visits/new', name: 'NewVisit', component: () => import('@/views/visits/VisitForm.vue') },
        { path: '/visits/edit/:id', name: 'EditVisit', component: () => import('@/views/visits/VisitForm.vue') },
        // Aides
        { path: '/aides', name: 'Aides', component: () => import('@/views/aides/AidesList.vue') },
        { path: '/aides/new', name: 'NewAide', component: () => import('@/views/aides/AideForm.vue') },
        { path: '/aides/edit/:id', name: 'EditAide', component: () => import('@/views/aides/AideForm.vue') },
        // Others
        { path: '/localisation', name: 'Localisation', component: () => import('@/views/localisation/Localisation.vue') },
        { path: '/cartography', name: 'Cartography', component: () => import('@/views/cartography/Cartography.vue') },
        { path: '/planning', name: 'Planning', component: () => import('@/views/planning/Planning.vue') },
        { path: '/history', name: 'History', component: () => import('@/views/history/History.vue') },
        { path: '/benevoles', name: 'Benevoles', component: () => import('@/views/benevoles/BenevolesList.vue') },
        { path: '/reports', name: 'Reports', component: () => import('@/views/reports/Reports.vue') },

       
    ]
};

export default MainRoutes;
