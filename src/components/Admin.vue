<template>
    <div>
      <h2>Admin</h2>
      <nav>
        <ul>
          <li>
            <router-link to="/challenges">Challenges</router-link>
          </li>
          <li>
            <router-link to="/students">Students</router-link>
          </li>
          <li>
            <router-link to="/classes">Classes</router-link>
          </li>
          <li>
            <router-link to="/challengequestion">Challenge Questions</router-link>
          </li>
        </ul>
      </nav>
      <router-view></router-view>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AdminTable',
  };
  </script>
  