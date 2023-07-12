import { createRouter, createWebHistory } from 'vue-router';
import ChallengeTable from '@/components/ChallengeTable.vue';
import StudentTable from '@/components/StudentTable.vue';
import ClassTable from '@/components/ClassTable.vue';
import HomeView from '@/components/HomeView.vue';
import LoginView from '@/components/LoginView.vue';
import ChallengeQuestionTable from '@/components/ChallengeQuestionTable.vue';
import Admin from '@/components/Admin.vue';
import ChallengePage from '@/components/ChallengePage.vue';
import ChallengeQuestionsPage from '@/components/ChallengeQuestionPage.vue';
import RegisterUser from '@/components/RegisterUser.vue';

const routes = [
  {
    path: '/admin',
    name: 'AdminTable',
    component: Admin,
    children: [
      {
        path: 'challenges',
        name: 'Challenges',
        component: ChallengeTable,
      },
      {
        path: 'students',
        name: 'Students',
        component: StudentTable,
      },
      {
        path: 'classes',
        name: 'Classes',
        component: ClassTable,
      },
      {
        path: 'challengeQuestions',
        name: 'ChallengeQuestions',
        component: ChallengeQuestionTable,
      },
    ],
  },
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
  // Route pour /challenge/:id
  {
    path: '/challenge/:id',
    name: 'ChallengePage',
    component: ChallengePage,
  },
  // Route pour /challenge/:id/questions
  {
    path: '/challenge/:id/questions',
    name: 'ChallengeQuestionsPage',
    component: ChallengeQuestionsPage,
  },
  // Route pour /register
  {
    path: '/register',
    name: 'RegisterUser',
    component: RegisterUser,
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
