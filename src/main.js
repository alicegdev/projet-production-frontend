import { createApp } from 'vue';
import App from './App.vue';
import './assets/main.css';
import { createRouter, createWebHistory } from 'vue-router';
import LoginView from './components/LoginView.vue';
import CryptoJS from 'crypto-js';

const app = createApp(App);

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '', component: LoginView },
    { path: '/auth/login', component: LoginView }
    // Autres routes de votre application
  ]
});


app.use(router);

app.mount('#app');

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