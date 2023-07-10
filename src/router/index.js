import { createRouter, createWebHistory } from 'vue-router';
import ChallengeTable from '@/components/ChallengeTable.vue';
import StudentTable from '@/components/StudentTable.vue';
import ClassTable from '@/components/ClassTable.vue';
import HomeView from '@/components/HomeView.vue';
import LoginView from '@/components/LoginView.vue';
import ChallengeQuestionTable from '@/components/ChallengeQuestionTable.vue';

const routes = [
  // Route pour /challenges
  {
    path: '/challenges',
    name: 'Challenges',
    component: ChallengeTable,
  },
  // Route pour /students
  {
    path: '/students',
    name: 'Students',
    component: StudentTable,
  },
  // Route pour /classes
  {
    path: '/classes',
    name: 'Classes',
    component: ClassTable,
  },
  // Route pour /challengequestion
    {
    path: '/challengequestion',
    name: 'ChallengeQuestion',
    component: ChallengeQuestionTable,
    },
  // Route pour la page d'accueil
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    children: [
      {
        path: '',
        name: 'Login',
        component: LoginView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;