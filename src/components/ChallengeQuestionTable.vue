<template>
  <div>
    <h2>Liste des questions de défi</h2>

    <label>Sélectionnez un défi :</label>
    <select v-model="selectedChallengeId">
      <option v-for="challenge in challenges" :key="challenge.id" :value="challenge.id">
        {{ challenge.name }}
      </option>
    </select>
    <button @click="fetchQuestionsByChallenge">Voir les questions de ce défi</button>

    <ul>
      <li v-for="question in questions" :key="question.id">
        {{ question.title }}
        <button @click="deleteQuestion(question.id)">Supprimer</button>
      </li>
    </ul>

    <h2>Ajouter une question de défi</h2>

    <!-- Formulaire pour créer ou mettre à jour une question de défi -->
    <form @submit.prevent="saveQuestion">
      <label>Titre :</label>
      <input type="text" v-model="currentQuestion.title" />

      <label>Description :</label>
      <textarea v-model="currentQuestion.description"></textarea>

      <label>Numéro de question :</label>
      <input type="number" v-model="currentQuestion.questionNumber" />

      <label>Points :</label>
      <input type="number" v-model="currentQuestion.questionValue" />

      <label>Défi :</label>
      <select v-model="currentQuestion.challengeId">
        <option v-for="challenge in challenges" :key="challenge.id" :value="challenge.id">
          {{ challenge.name }}
        </option>
      </select>

      <label>Commande de la solution :</label>
      <textarea v-model="currentQuestion.solution.command"></textarea>

      <label>Réponse attendue :</label>
      <textarea v-model="currentQuestion.solution.expectedResponse"></textarea>

      <label>Erreur attendue :</label>
      <textarea v-model="currentQuestion.solution.expectedError"></textarea>

      <button type="submit">{{ editingQuestion ? 'Mettre à jour' : 'Créer' }}</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      questions: [], // Liste des questions de défi
      challenges: [], // Liste des défis
      selectedChallengeId: null, // ID du défi sélectionné
      currentQuestion: {
        title: '',
        description: '',
        questionNumber: null,
        questionValue: null,
        challengeId: null,
        solution: {
          command: '',
          expectedResponse: '',
          expectedError: '',
        },
      }, // Question de défi en cours d'édition ou création
      editingQuestion: false, // Indicateur de mode d'édition
    };
  },
  mounted() {
    // Appel à l'API pour récupérer la liste des défis
    this.fetchChallenges();
  },
  methods: {
    fetchQuestionsByChallenge() {
      if (this.selectedChallengeId) {
        axios
          .get(`http://localhost:8000/api/challengeQuestions/${this.selectedChallengeId}`)
          .then((response) => {
            this.questions = response.data;
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des questions de défi:', error);
          });
      }
    },
    fetchChallenges() {
      axios
        .get('http://localhost:8000/api/challenges')
        .then((response) => {
          this.challenges = response.data;
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des défis:', error);
        });
    },
    saveQuestion() {
      if (this.editingQuestion) {
        // Mettre à jour la question de défi existante
        axios
          .put(`http://localhost:8000/api/challengeQuestions/${this.currentQuestion.id}`, {
            title: this.currentQuestion.title,
            description: this.currentQuestion.description,
            questionNumber: this.currentQuestion.questionNumber,
            questionValue: this.currentQuestion.questionValue,
            challengeId: this.currentQuestion.challengeId,
          })
          .then(() => {
            this.resetForm();
            this.fetchQuestionsByChallenge();
          })
          .catch((error) => {
            console.error('Erreur lors de la mise à jour de la question de défi:', error);
          });
      } else {
        // Créer une nouvelle question de défi
        axios
          .post('http://localhost:8000/api/challengeQuestions', {
            title: this.currentQuestion.title,
            description: this.currentQuestion.description,
            questionNumber: this.currentQuestion.questionNumber,
            questionValue: this.currentQuestion.questionValue,
            challengeId: this.currentQuestion.challengeId,
          })
          .then((response) => {
            const challengeQuestionId = response.data.id;
            axios
              .post('http://localhost:8000/api/solutions', {
                command: this.currentQuestion.solution.command,
                expectedResponse: this.currentQuestion.solution.expectedResponse,
                expectedError: this.currentQuestion.solution.expectedError,
                challengeQuestionId: challengeQuestionId,
              })
              .then(() => {
                this.resetForm();
                this.fetchQuestionsByChallenge();
              })
              .catch((error) => {
                console.error('Erreur lors de la création de la solution:', error);
              });
          })
          .catch((error) => {
            console.error('Erreur lors de la création de la question de défi:', error);
          });
      }
    },
    editQuestion(question) {
      this.currentQuestion = { ...question };
      this.editingQuestion = true;
    },
    deleteQuestion(id) {
      axios
        .delete(`http://localhost:8000/api/challengeQuestions/${id}`)
        .then(() => {
          this.fetchQuestionsByChallenge();
        })
        .catch((error) => {
          console.error('Erreur lors de la suppression de la question de défi:', error);
        });
    },
    resetForm() {
      this.currentQuestion = {
        title: '',
        description: '',
        questionNumber: null,
        questionValue: null,
        challengeId: null,
        solution: {
          command: '',
          expectedResponse: '',
          expectedError: '',
        },
      };
      this.editingQuestion = false;
    },
  },
};
</script>
