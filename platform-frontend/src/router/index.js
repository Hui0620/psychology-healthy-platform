import { createRouter, createWebHistory } from 'vue-router'
import { unauthorized } from "@/net";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'welcome',
            component: () => import('@/views/WelcomeView.vue'),
            children: [
                {
                    path: '',
                    name: 'welcome-login',
                    component: () => import('@/views/welcome/LoginPage.vue')
                }
            ]
        },
        {
            path:'/ai-medical-data-federal-system',
            name:'ai-medical-data-federal-system',
            component:() => import('@/views/StartView.vue')
        },
        {
            path: '/index',
            name: 'index',
            component: () => import('@/views/IndexView.vue'),
            children:[
                {
                    path: '',
                    name: 'index-content',
                    component: () => import('@/views/content.vue'),
                    children:[
                        {
                            path: '',
                            name: 'patientIdInput',
                            component: () => import('@/components/PatientIdInput.vue'),
                        },

                        {
                            path: 'new-medical',
                            name: 'newMedical',
                            component: () => import('@/components/NewMedical.vue'),
                        },
                        {
                            path: 'user-profile',
                            name: 'userProfile',
                            component: () => import('@/components/UserProfile.vue'),
                        },
                        {
                            path: 'diagnosis',
                            name: 'diagnosis',
                            component: () => import('@/components/Diagnosis.vue'),
                        },
                        {
                            path: 'ai-report',
                            name: 'aiReport',
                            component: () => import('@/components/AIReport.vue'),
                        },
                        {
                            path: 'patients',
                            name: 'patients',
                            component: () => import('@/components/patients.vue'),
                        },
                        {
                            path:'admin',
                            name:'adminPanel',
                            component: () => import('@/components/AdminPanel.vue')
                        }
                    ]
                }
            ]
        },
        {
            path: '/counselor',
            name: 'counselor',
            component: () => import('@/views/CounselorView.vue'),
            children:[
                {
                    path: '',
                    name: 'counselor-content',
                    component: () => import('@/views/counselor-content.vue'),
                    children:[
                        {
                            path: '',
                            name: 'counselor-patientIdInput',
                            component: () => import('@/components/counselor/PatientIdInput.vue'),
                        },
                        {
                            path: 'new-medical',
                            name: 'counselor-newMedical',
                            component: () => import('@/components/counselor/NewMedical.vue'),
                        },
                        {
                            path: 'user-profile',
                            name: 'counselor-userProfile',
                            component: () => import('@/components/counselor/UserProfile.vue'),
                        },
                        {
                            path: 'diagnosis',
                            name: 'counselor-diagnosis',
                            component: () => import('@/components/counselor/Diagnosis.vue'),
                        },
                        {
                            path: 'referral',
                            name: 'counselor-referral',
                            component: () => import('@/components/ReferralSuggestion.vue'),
                        }
                    ]
                }
            ]
        },{
            path:'/current',
            name:'currentTask',
            component:() => import('@/components/currentTask.vue')
        },{
            path:'/monitor',
            name:'monitor',
            component:() => import('@/components/index.vue')
        },
        {
            path: '/admin',
            name: 'Admin',
            component: () => import('@/views/AdminView.vue'),
        },
        {
            path: '/admin/model-detail/:id',
            name: 'ModelDetail',
            component: () => import('@/views/ModelDetail.vue')
        }
    ]
})

router.beforeEach((to, from, next) => {
    const isUnauthorized = unauthorized()
    if(to.name.startsWith('welcome') && !isUnauthorized) {
        next('/index')
    } else if((to.fullPath.startsWith('/index') || to.fullPath.startsWith('/current')|| to.fullPath.startsWith('/monitor') || to.fullPath.startsWith('/counselor'))&& isUnauthorized) {
        next('/')
    } else {
        next()
    }
})



export default router
