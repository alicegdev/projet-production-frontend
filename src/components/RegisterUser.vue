<template>
  <div>
    <form @submit="registerUser">
      <input type="email" v-model="email" placeholder="Email" required />
      <input type="text" v-model="firstName" placeholder="First Name" required />
      <input type="text" v-model="lastName" placeholder="Last Name" required />
      <button type="submit">Register</button>
    </form>
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      email: "",
      firstName: "",
      lastName: "",
      errorMessage: "",
      successMessage: ""
    };
  },
  methods: {
    registerUser(event) {
      const userData = {
        email: this.email,
        firstName: this.firstName,
        lastName: this.lastName
      };
      event.preventDefault();
      console.log("Registering user:", userData);
      axios
        .post("http://localhost:8000/auth/register", userData)
        .then((response) => {
          console.log(response.data);
          this.successMessage =
            "Registration successful. Please check your email for the magic link to login.";
          this.errorMessage = "";
          this.resetForm();
        })
        .catch((error) => {
          console.error("Error registering user:", error);
        });
    },
    resetForm() {
      this.email = "";
      this.firstName = "";
      this.lastName = "";
    }
  }
};
</script>
