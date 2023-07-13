<template>
    <div>
      <h2>Liste des challenges</h2>
  
      <!-- Affichage de la liste des challenges -->
      <ul>
        <li v-for="challenge in challenges" :key="challenge.id">
          {{ challenge.name }}
          <button @click="editChallenge(challenge)">Modifier</button>
          <button @click="deleteChallenge(challenge.id)">Supprimer</button>
        </li>
      </ul>
  
      <h2>Ajouter un challenge</h2>
  
      <!-- Formulaire pour créer ou mettre à jour un challenge -->
      <form @submit.prevent="saveChallenge">
        <label>Nom du challenge:</label>
        <input type="text" v-model="currentChallenge.name" />

        <label>Classe:</label>
  <select v-model="currentChallenge.classId">
    <option v-for="classItem in classes" :key="classItem.id" :value="classItem.id">
      {{ classItem.name }}
    </option>
  </select>

  
        <button type="submit">{{ editingChallenge ? 'Mettre à jour' : 'Créer' }}</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        challenges: [], // Liste des challenges
        currentChallenge: { name: '' }, // Challenge en cours d'édition ou création
        editingChallenge: false, // Indicateur de mode d'édition
        classes: [], // Liste des classes
      };
    },
    mounted() {
      // Appel à l'API pour récupérer la liste des challenges existants
      this.fetchChallenges();
      this.fetchClasses();
    },
    methods: {
      fetchChallenges() {
        axios.get('https://challenge-api.xyz/api/challenges')
          .then((response) => {
            this.challenges = response.data;
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des challenges:', error);
          });
      },
      fetchClasses() {
        axios.get('https://challenge-api.xyz/api/classes')
          .then((response) => {
            this.classes = response.data;
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des classes:', error);
          });
      },
      saveChallenge() {
  if (this.editingChallenge) {
    // Mettre à jour le challenge existant
    axios.put(`https://challenge-api.xyz/api/challenges/${this.currentChallenge.id}`, { name: this.currentChallenge.name })
      .then(() => {
        this.resetForm();
        this.fetchChallenges();
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour du challenge:', error);
      });
  } else {
    // Créer un nouveau challenge
    axios.post('https://challenge-api.xyz/api/challenges', { name: this.currentChallenge.name })
      .then((response) => {
        const challengeId = response.data.id;
        const classId = this.currentChallenge.classId;

        // Enregistrer l'association dans la table class_challenges
        axios.post('https://challenge-api.xyz/api/classChallenges', { classId, challengeId })
          .then(() => {
            this.resetForm();
            this.fetchChallenges();
          })
          .catch((error) => {
            console.error('Erreur lors de la création de l\'association class_challenges:', error);
          });
      })
      .catch((error) => {
        console.error('Erreur lors de la création du challenge:', error);
      });
  }
},

editChallenge(challenge) {
  this.currentChallenge = { ...challenge };
  this.editingChallenge = true;
},

      deleteChallenge(id) {
        axios.delete(`https://challenge-api.xyz/api/challenges/${id}`)
          .then(() => {
            this.fetchChallenges();
          })
          .catch((error) => {
            console.error('Erreur lors de la suppression du challenge:', error);
          });
      },
      resetForm() {
        this.currentChallenge = { name: '' };
        this.editingChallenge = false;
      },
    },
  };
  </script>
  