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

    <button @click="launchTest" :disabled="isLoading || !isConnectionInfoAvailable" :class="getStatusButton()">
      {{ isLoading ? 'Chargement...' : 'Lancer le test' }}
    </button>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      questions: [],
      solutions: [],
      solutionsMap: {},
      lastQuestionId: null,
      filteredQuestions: [],
      isLoading: false,
      score: 0,
      isConnectionInfoAvailable: false,
    };
  },
  mounted() {
    const challengeId = this.$route.params.id;
    axios
      .get(`https://challenge-api.xyz/api/challengeQuestions/${challengeId}`)
      .then((response) => {
        this.questions = response.data.sort((a, b) => a.questionNumber - b.questionNumber);
        this.fetchSolutions();
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des questions du challenge:', error);
      });

    // Vérifier si les informations de connexion de l'étudiant sont disponibles
    const userId = 1; // Utilisateur connecté (temporaire)
    this.getStudentConnection(userId);
  },
  methods: {
    fetchSolutions() {
      const questionIds = this.questions.map((question) => question.id);
      axios
        .get(`https://challenge-api.xyz/api/solutions/forQuestions/${questionIds.join(',')}`)
        .then((response) => {
          this.solutions = response.data;
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
      if (this.isLoading || !this.isConnectionInfoAvailable) {
        return;
      }

      this.isLoading = true;

      const orderedSolutions = this.questions
        .map((question) => {
          const solution = this.solutions.find((sol) => sol.challengeQuestionId === question.id);
          return { questionNumber: question.questionNumber, solution };
        })
        .sort((a, b) => a.questionNumber - b.questionNumber)
        .filter((item) => item.solution);

      const solutionCommands = orderedSolutions.map((item) => ({
        command: item.solution.command,
        questionId: item.solution.challengeQuestionId,
        expectedResponse: item.solution.expectedResponse,
      }));

      axios
        .post(`https://challenge-api.xyz/api/challengeQuestions/test/${this.questions[0].challengeId}`, {
          solutionCommands,
        })
        .then((response) => {
          const filteredResponses = Object.values(response.data);
          this.getFilteredQuestions(filteredResponses);

          if (filteredResponses.length > 0) {
            const lastResponse = filteredResponses[filteredResponses.length - 1];
            this.lastQuestionId = lastResponse.lastQuestionId;
          }

          const score = this.calculateScore(filteredResponses);
          this.updateScore(score);
        })
        .catch((error) => {
          console.error('Erreur lors du lancement du test:', error);
        })
        .finally(() => {
          setTimeout(() => {
            this.isLoading = false;
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

          if (response.status === 'OK') {
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

      if (filteredQuestions.length > 0) {
        this.lastQuestionId = filteredQuestions[filteredQuestions.length - 1].id;
      }
    },
    getStatusClass(question) {
      return {
        'status-success': question.status === 'OK',
        'status-warning': question.status !== 'OK',
      };
    },
    getStatusMessage(question) {
      return `${question.status}: ${question.message}`;
    },
    getStatusButton() {
      if (this.isLoading) {
        return 'btn-loading';
      } else if (!this.isConnectionInfoAvailable) {
        return 'btn-disabled';
      } else {
        return 'btn-success';
      }
    },
    getStudentConnection(userId) {
      axios
        .get(`https://challenge-api.xyz/api/studentConnection/${userId}`)
        .then((response) => {
          console.log(response.data);
          this.isConnectionInfoAvailable = true;
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des informations de connexion:', error);
        });
    },
    calculateScore(filteredResponses) {
      let score = 0;
      filteredResponses.forEach((response) => {
        if (response.status === 'OK') {
          const question = this.questions.find((q) => q.id === response.lastQuestionId);
          score += question.questionValue;
        }
      });
      return score;
    },
    updateScore(score) {
      const userId = 1; // Utilisateur connecté (temporaire)
      const challengeId = this.$route.params.id;
      const data = {
        studentId: userId,
        challengeId,
        score,
      };

      axios
        .put('https://challenge-api.xyz/api/scores', data)
        .then((response) => {
          console.log('Score updated successfully', response.data);
          this.score = score;
        })
        .catch((error) => {
          console.error('Error updating score:', error);
        });
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

.btn {
  background-color: #00dba4;
  border: none;
  color: white;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease 0s;
}

.btn:hover {
  background-color: #00c295;
}

.btn-success {
  background-color: #00dba4;
  border: none;
  color: white;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease 0s;
}

.btn-success:hover {
  background-color: #00c295;
}

.btn-disabled {
  background-color: #e0e0e0;
  border: none;
  color: white;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 4px;
  cursor: not-allowed;
  transition: all 0.3s ease 0s;
}

.btn-disabled:hover {
  background-color: #e0e0e0;
}

.btn-loading {
  background-color: #00dba4;
  border: none;
  color: white;
  padding: 8px 16px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  border-radius: 4px;
  cursor: progress;
  transition: all 0.3s ease 0s;
}

.btn-loading:hover {
  background-color: #00dba4;
}

</style>
