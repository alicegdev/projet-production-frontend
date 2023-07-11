<template>
    <div>
      <h2 v-if="challenge">{{ challenge.name }}</h2>
      <router-link v-if="challenge" :to="'/challenge/' + challenge.id + '/questions'">Accéder aux questions</router-link>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        challenge: null, // Détails du challenge
      };
    },
    mounted() {
      // Récupérer l'ID du challenge depuis les paramètres d'URL
      const challengeId = this.$route.params.id;
      // Appel à l'API pour récupérer les détails du challenge
      axios
        .get(`http://localhost:8000/api/challenges/${challengeId}`)
        .then((response) => {
          this.challenge = response.data;
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des détails du challenge:', error);
        });
    },
  };
  </script>
  