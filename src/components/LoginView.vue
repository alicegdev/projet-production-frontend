<template>
  <NavbarComp />
  <form @submit.prevent="handleSubmit">
    <h3>Login</h3>

    <label for="username">Nom d'utilisateur : </label>
    <input type="username" name="username" ref="username" v-model="username" required />

    <label for="password">Mot de passe :</label>
    <input type="password" name="password" ref="password" v-model="password" required />

    <button>Login</button>
  </form>
</template>

<script>
import { ref } from "vue";
import axios from "axios";
import NavbarComp from "./NavbarComp.vue";

export default {
  name: "LoginView",
  components: {
    NavbarComp,
  },
  setup() {
    const username = ref("username");
    const password = ref("password");

    const handleSubmit = async (username, password) => {
      const response = await axios.post(
        "http://localhost:8000/api/users/loginAsAdmin",
        {
          username: username,
          password: password,
        }
      );
      console.log(username, password, response);
    };

    return { handleSubmit, username, password };
  },
};
</script>
