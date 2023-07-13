import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../components/LoginView.vue";
import ChallengeTable from "../components/ChallengeTable.vue";
import ChallengeQuestionTable from "../components/ChallengeTable.vue";
import StudentTable from "../components/StudentTable.vue";
import ClassTable from "../components/ClassTable.vue";
import HomeView from "../components/HomeView.vue";
import Admin from "../components/Admin.vue";
import ChallengePage from "../components/ChallengePage.vue";
import ChallengeQuestionsPage from "../components/ChallengeQuestionPage.vue";
import RegisterUser from "../components/RegisterUser.vue";
import CryptoJS from "crypto-js";

const routes = [
  {
    path: "/admin",
    name: "AdminTable",
    component: Admin,
    children: [
      {
        path: "challenges",
        name: "Challenges",
        component: ChallengeTable,
      },
      {
        path: "students",
        name: "Students",
        component: StudentTable,
      },
      {
        path: "classes",
        name: "Classes",
        component: ClassTable,
      },
      {
        path: "challengeQuestions",
        name: "ChallengeQuestions",
        component: ChallengeQuestionTable,
      },
    ],
  },
  {
    path: "/challenges",
    name: "Challenges",
    component: ChallengeTable,
  },
  {
    path: "/students",
    name: "Students",
    component: StudentTable,
  },
  {
    path: "/classes",
    name: "Classes",
    component: ClassTable,
  },
  {
    path: "/challengequestion",
    name: "ChallengeQuestion",
    component: ChallengeQuestionTable,
  },
  {
    path: "/challenge/:id",
    name: "ChallengePage",
    component: ChallengePage,
  },
  {
    path: "/challenge/:id/questions",
    name: "ChallengeQuestionsPage",
    component: ChallengeQuestionsPage,
  },
  {
    path: "/register",
    name: "RegisterUser",
    component: RegisterUser,
  },
  {
    path: "/",
    name: "Home",
    component: HomeView,
    children: [
      {
        path: "",
        name: "Login",
        component: LoginView,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const jwt = new URLSearchParams(window.location.search).get("jwt");
  const secretKey = process.env.VUE_APP_SECRET_KEY;
  const encryptedJWT = CryptoJS.AES.encrypt(jwt, secretKey).toString();
  const jwtObj = {
    jwt: encryptedJWT,
    timestamp: Date.now(),
  };
  localStorage.setItem("jwtData", JSON.stringify(jwtObj));
  console.log("Token set in localStorage");

  if (jwt) {
    localStorage.setItem("jwt", encryptedJWT);
  }

  next();
});

export default router;
