<template>
  <div>
    <h2 v-if="challenge">{{ challenge.name }}</h2>
    <form @submit.prevent="submitForm">
      <label for="dbHost">Database Host:</label>
      <input type="text" id="dbHost" v-model="dbHost" required>
      <label for="dbPort">Database Port:</label>
      <input type="text" id="dbPort" v-model="dbPort" required>
      <label for="dbUserName">Database User Name:</label>
      <input type="text" id="dbUserName" v-model="dbUserName" required>
      <label for="dbPassword">Database Password:</label>
      <input type="password" id="dbPassword" v-model="dbPassword" required>
      <label for="dbName">Database Name:</label>
      <input type="text" id="dbName" v-model="dbName" required>
      <label for="sshHost">SSH Host:</label>
      <input type="text" id="sshHost" v-model="sshHost" required>
      <label for="sshName">SSH Username:</label>
      <input type="text" id="sshName" v-model="sshName" required>

      <button type="submit" :disabled="!isFormValid">Continuer</button>
    </form>
    <router-link v-if="challenge && isFormValid" :to="'/challenge/' + challenge.id + '/questions'">Accéder aux questions</router-link>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      challenge: null, // Détails du challenge
      dbHost: '',
      dbPort: '',
      dbUserName: '',
      dbPassword: '',
      dbName: '',
      sshHost: '',
      sshName: '',
    };
  },
  computed: {
    isFormValid() {
      return (
        this.dbHost !== '' &&
        this.dbPort !== '' &&
        this.dbUserName !== '' &&
        this.dbPassword !== '' &&
        this.dbName !== '' &&
        this.sshHost !== '' &&
        this.sshName !== ''
      );
    },
  },
  methods: {
    submitForm() {
      const userId = 4; // Utilisateur connecté (temporaire)
      const challengeId = this.$route.params.id;
      const connectionData = {
        dbHost: this.dbHost,
        dbPort: this.dbPort,
        dbUserName: this.dbUserName,
        dbPassword: this.dbPassword,
        dbName: this.dbName,
        sshHost: this.sshHost,
        sshName: this.sshName,
        userId,
        challengeId,
      };

      this.insertStudentDBInfo(connectionData);
    },
    insertStudentDBInfo(connectionData) {
      console.log(connectionData);
      axios
        .post('http://localhost:8000/api/studentConnection', connectionData)
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error('Erreur lors de l\'insertion des informations de connexion:', error);
        });
    },
    fetchChallenge() {
      const challengeId = this.$route.params.id;
      axios
        .get(`http://localhost:8000/api/challenges/${challengeId}`)
        .then((response) => {
          this.challenge = response.data;
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des détails du challenge:', error);
        });
    },
  },
  mounted() {
    this.fetchChallenge();
  },
};
</script>
