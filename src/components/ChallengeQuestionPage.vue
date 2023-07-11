<template>
  <div>
    <h2>Liste des questions du challenge</h2>

    <p v-if="!isLoading">Score: {{ score }}</p>

    <div v-if="isLoading" class="loader"></div>

    <ul v-if="!isLoading">
      <li v-for="question in filteredQuestions" :key="question.questionNumber">
        <h3>{{ question.title }}</h3>
        <p>{{ question.description }}</p>
        <div :class="getStatusClass(question)">
          <code>{{ getStatusMessage(question) }}</code>
        </div>
      </li>
    </ul>

    <button @click="launchTest" :disabled="isLoading">
      {{ isLoading ? 'Chargement...' : 'Lancer le test' }}
    </button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      questions: [], // Liste des questions du challenge
      solutions: [], // Liste des solutions du challenge
      solutionsMap: {}, // Map des solutions par ID de question
      lastQuestionId: null, // ID de la dernière question traitée
      filteredQuestions: [], // Liste filtrée des questions à afficher
      isLoading: false, // État de chargement
      score: 0, // Score du challenge
    };
  },
  mounted() {
    // Récupérer l'ID du challenge depuis les paramètres d'URL
    const challengeId = this.$route.params.id;
    // Appel à l'API pour récupérer les questions du challenge
    axios
      .get(`http://localhost:8000/api/challengeQuestions/${challengeId}`)
      .then((response) => {
        this.questions = response.data.sort((a, b) => a.questionNumber - b.questionNumber);
        // Récupérer les solutions liées aux questions du challenge
        this.fetchSolutions();
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des questions du challenge:', error);
      });
  },
  computed: {},
  methods: {
    fetchSolutions() {
      // Récupérer les IDs des questions du challenge
      const questionIds = this.questions.map((question) => question.id);
      // Appel à l'API pour récupérer les solutions liées aux questions
      axios
        .get(`http://localhost:8000/api/solutions/forQuestions/${questionIds.join(',')}`)
        .then((response) => {
          this.solutions = response.data;
          // Créer la map des solutions par ID de question
          this.solutionsMap = {};
          this.solutions.forEach((solution) => {
            this.solutionsMap[solution.challengeQuestionId] = solution;
          });
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des solutions des questions:', error);
        });
    },
    launchTest() {
      if (this.isLoading) {
        return;
      }

      this.isLoading = true; // Activer l'état de chargement

      const orderedSolutions = this.questions
        .map((question) => {
          const solution = this.solutions.find((sol) => sol.challengeQuestionId === question.id);
          return { questionNumber: question.questionNumber, solution };
        })
        .sort((a, b) => a.questionNumber - b.questionNumber)
        .filter((item) => item.solution); // Supprimez les questions sans solution

      const solutionCommands = orderedSolutions.map((item) => ({
        command: item.solution.command,
        questionId: item.solution.challengeQuestionId,
        expectedResponse: item.solution.expectedResponse,
      }));

      // Appel à l'API pour lancer le test en envoyant les commandes des solutions
      axios
        .post(`http://localhost:8000/api/challengeQuestions/test/${this.questions[0].challengeId}`, {
          solutionCommands,
        })
        .then((response) => {
          const filteredResponses = Object.values(response.data);
          this.getFilteredQuestions(filteredResponses);

          // Mise à jour de la liste des questions à afficher
          if (filteredResponses.length > 0) {
            const lastResponse = filteredResponses[filteredResponses.length - 1];
            this.lastQuestionId = lastResponse.lastQuestionId; // Mettez à jour l'ID de la dernière question traitée
          }
        })
        .catch((error) => {
          console.error('Erreur lors du lancement du test:', error);
        })
        .finally(() => {
          setTimeout(() => {
            this.isLoading = false; // Désactiver l'état de chargement après 1 seconde
          }, 1000);
        });
    },
    getFilteredQuestions(data) {
      const filteredQuestions = [];
      let score = 0;
      const lastQuestionIndex = data.length - 1;

      for (let i = 0; i < data.length; i++) {
        const response = data[i];
        const question = this.questions.find((q) => q.id === response.lastQuestionId);
        const solution = this.solutionsMap[question.id];

        if (question && solution) {
          const copiedQuestion = { ...question };
          if (response.status && response.message) {
            copiedQuestion.status = response.status;
            copiedQuestion.message = response.message;
          }

          filteredQuestions.push(copiedQuestion);

          if (response.status === "OK") {
          console.log(question.questionValue)
          score += question.questionValue;
          } 

        }

        if (response.error) {
          break;
        }

        if (i === lastQuestionIndex) {
          filteredQuestions.push(...this.questions.slice(i + 1));
        }
      }

      this.filteredQuestions = filteredQuestions;
      this.score = score;

      console.log('filteredQuestions', filteredQuestions)

      if (filteredQuestions.length > 0) {
        this.lastQuestionId = filteredQuestions[filteredQuestions.length - 1].id;
      }
    },
    getStatusClass(question) {
      return {
        'status-success': question.status === "OK",
        'status-warning': question.status !== "OK",
      };
    },
    getStatusMessage(question) {
      return `${question.status}: ${question.message}`;
    },
  },
};
</script>

<style>
.status-success {
  background-color: #c8e6c9;
  width: 80%;
  height: 48px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 4px solid #66bb6a;
}

.status-warning {
  background-color: #fff9c4;
  width: 80%;
  height: 48px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 4px solid #fdd835;
}

.loader {
  border: 8px solid #f3f3f3;
  border-top: 8px solid #00dba4;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

ul {
  list-style-type: none;
  margin-bottom: 16px;
  padding: 0;
}

li {
  padding: 8px;
  margin-bottom: 8px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
