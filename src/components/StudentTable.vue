<template>
    <div>
      <h2>Liste des étudiants</h2>
  
      <!-- Affichage de la liste des étudiants -->
      <ul>
        <li v-for="student in students" :key="student.id">
          {{ student.studentFirstName }} {{ student.studentLastName }}
          <button @click="editStudent(student)">Modifier</button>
          <button @click="deleteStudent(student.userId)">Supprimer</button>
        </li>
      </ul>
  
      <h2>Ajouter un étudiant</h2>
  
      <!-- Formulaire pour créer ou mettre à jour un étudiant -->
      <form @submit.prevent="saveStudent">
        <label>Prénom de l'étudiant:</label>
        <input type="text" v-model="currentStudent.studentFirstName" />
  
        <label>Nom de l'étudiant:</label>
        <input type="text" v-model="currentStudent.studentLastName" />
  
        <label>Utilisateur:</label>
        <input type="text" v-model="search" @input="fetchUsers" @keydown.enter="validateSearch" placeholder="Rechercher un utilisateur" />
        <ul>
          <li v-for="user in filteredUsers" :key="user.id" @click="selectUser(user)">
            {{ user.id }}
          </li>
        </ul>
  
        <button type="submit">{{ editingStudent ? 'Mettre à jour' : 'Créer' }}</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        students: [], // Liste des étudiants
        users: [], // Liste des utilisateurs
        search: '', // Terme de recherche
        currentStudent: { studentFirstName: '', studentLastName: '', userId: null }, // Étudiant en cours d'édition ou création
        editingStudent: false, // Indicateur de mode d'édition
      };
    },
    mounted() {
      // Appel à l'API pour récupérer la liste des étudiants existants
      this.fetchStudents();
    },
    methods: {
      fetchStudents() {
        axios
          .get('http://localhost:8000/api/students')
          .then((response) => {
            this.students = response.data;
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des étudiants:', error);
          });
      },
      fetchUsers() {
        axios
          .get(`http://localhost:8000/api/users?search=${this.search}`)
          .then((response) => {
            this.users = response.data;
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des utilisateurs:', error);
          });
      },
      selectUser(user) {
        this.currentStudent.userId = user.id;
        this.search = user.id;
        this.users = []; // Réinitialiser la liste des utilisateurs après la sélection
      },
      validateSearch() {
        const selectedUser = this.users.find((user) => user.id.toString().toLowerCase() === this.search.toLowerCase());
        if (selectedUser) {
          this.currentStudent.userId = selectedUser.id;
        } else {
          this.currentStudent.userId = null;
        }
      },
      saveStudent() {
        if (this.editingStudent) {
          // Mettre à jour l'étudiant existant
          axios
            .put(`http://localhost:8000/api/students/${this.currentStudent.id}`, {
              studentFirstName: this.currentStudent.studentFirstName,
              studentLastName: this.currentStudent.studentLastName,
              userId: this.currentStudent.userId,
            })
            .then(() => {
              this.resetForm();
              this.fetchStudents();
            })
            .catch((error) => {
              console.error('Erreur lors de la mise à jour de l\'étudiant:', error);
            });
        } else {
          // Créer un nouvel étudiant
          axios
            .post('http://localhost:8000/api/students', {
              studentFirstName: this.currentStudent.studentFirstName,
              studentLastName: this.currentStudent.studentLastName,
              userId: this.currentStudent.userId,
            })
            .then(() => {
              this.resetForm();
              this.fetchStudents();
            })
            .catch((error) => {
              console.error('Erreur lors de la création de l\'étudiant:', error);
            });
        }
      },
      editStudent(student) {
        this.currentStudent = { ...student };
        this.editingStudent = true;
      },
      deleteStudent(id) {
    axios
      .delete(`http://localhost:8000/api/students/${id}`)
      .then(() => {
        // Utilisez l'id de l'étudiant pour la suppression
        this.fetchStudents();
      })
      .catch((error) => {
        console.error('Erreur lors de la suppression de l\'étudiant:', error);
      });
  },
      resetForm() {
        this.currentStudent = { studentFirstName: '', studentLastName: '', userId: null };
        this.editingStudent = false;
      },
    },
    computed: {
      filteredUsers() {
        return this.users.filter((user) => user.id.toString().toLowerCase().includes(this.search.toLowerCase()));
      },
    },
  };
  </script>

<style>
.selected {
  background-color: #e2e8f0;
  cursor: pointer;
}
</style>