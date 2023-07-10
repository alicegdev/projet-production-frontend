<template>
    <div>
      <h2>Liste des classes</h2>
  
      <!-- Affichage de la liste des classes -->
      <ul>
        <li v-for="classItem in classes" :key="classItem.id">
          {{ classItem.name }}
          <button @click="editClass(classItem)">Modifier</button>
          <button @click="deleteClass(classItem.id)">Supprimer</button>
        </li>
      </ul>
  
      <h2>Ajouter une classe</h2>
  
      <!-- Formulaire pour créer ou mettre à jour une classe -->
      <form @submit.prevent="saveClass">
        <label>Nom de la classe:</label>
        <input type="text" v-model="currentClass.name" />
  
        <button type="submit">{{ editingClass ? 'Mettre à jour' : 'Créer' }}</button>
      </form>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        classes: [], // Liste des classes
        currentClass: { name: '' }, // Classe en cours d'édition ou création
        editingClass: false, // Indicateur de mode d'édition
      };
    },
    mounted() {
      // Appel à l'API pour récupérer la liste des classes existantes
      this.fetchClasses();
    },
    methods: {
      fetchClasses() {
        axios
          .get('http://localhost:8000/api/classes')
          .then((response) => {
            this.classes = response.data;
          })
          .catch((error) => {
            console.error('Erreur lors de la récupération des classes:', error);
          });
      },
      saveClass() {
        if (this.editingClass) {
          // Mettre à jour la classe existante
          axios
            .put(`http://localhost:8000/api/classes/${this.currentClass.id}`, {
              name: this.currentClass.name,
            })
            .then(() => {
              this.resetForm();
              this.fetchClasses();
            })
            .catch((error) => {
              console.error('Erreur lors de la mise à jour de la classe:', error);
            });
        } else {
          // Créer une nouvelle classe
          axios
            .post('http://localhost:8000/api/classes', {
              name: this.currentClass.name,
            })
            .then(() => {
              this.resetForm();
              this.fetchClasses();
            })
            .catch((error) => {
              console.error('Erreur lors de la création de la classe:', error);
            });
        }
      },
      editClass(classItem) {
        this.currentClass = { ...classItem };
        this.editingClass = true;
      },
      deleteClass(id) {
        axios
          .delete(`http://localhost:8000/api/classes/${id}`)
          .then(() => {
            this.fetchClasses();
          })
          .catch((error) => {
            console.error('Erreur lors de la suppression de la classe:', error);
          });
      },
      resetForm() {
        this.currentClass = { name: '' };
        this.editingClass = false;
      },
    },
  };
  </script>
  