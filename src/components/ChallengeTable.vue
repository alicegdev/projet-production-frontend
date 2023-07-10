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
      };
    },
    mounted() {
      // Appel à l'API pour récupérer la liste des challenges existants
      this.fetchChallenges();
    },
    methods: {
      fetchChallenges() {
        axios.get('http://localhost:8000/api/challenges')
          .then((response) => {
            this.challenges = response.data;
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des challenges:', error);
          });
      },
      saveChallenge() {
        if (this.editingChallenge) {
          // Mettre à jour le challenge existant
          axios.put(`http://localhost:8000/api/challenges/${this.currentChallenge.id}`, { name: this.currentChallenge.name })
            .then(() => {
              this.resetForm();
              this.fetchChallenges();
            })
            .catch((error) => {
              console.error('Erreur lors de la mise à jour du challenge:', error);
            });
        } else {
            console.log(this.currentChallenge.name)
          // Créer un nouveau challenge
          axios.post('http://localhost:8000/api/challenges', { name: this.currentChallenge.name })
            .then(() => {
              this.resetForm();
              this.fetchChallenges();
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
        axios.delete(`http://localhost:8000/api/challenges/${id}`)
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
  