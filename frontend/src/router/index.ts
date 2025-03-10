// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router'
import { TABS } from '../constants/tabs'

// Importy komponentów
import CarList from '@/views/CarList.vue'
import TrackedUrls from '@/views/TrackedUrls.vue'

const routes = [
    {
        path: '/',
        redirect: TABS[0].path // Przekierowanie z głównej strony na pierwszy tab
    },
    {
        path: '/urls',
        name: 'urls',
        component: TrackedUrls
    },
    {
        path: '/cars',
        name: 'cars',
        component: CarList,
        // Dodajemy props: true, aby przekazywać parametry jako props
        props: (route) => ({ query: route.query })
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
