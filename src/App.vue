<template>
  <v-app>
    <v-main class="main">
      <router-view />
    </v-main>
    <v-footer class="footer" padless>
      <span>{{ new Date().getFullYear() }} - Spot The Pie</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',
});
</script>

<style>
body {
  background-color: #535353;
}

body * {
  font-family: Montserrat, sans-serif;
}

.main {
  background-color: #282828;
  color: #ffffff;
}

.v-application .main * {
  margin: 0;
  padding: 0;
}

footer.v-footer.footer {
  background-color: #535353;
  color: #b3b3b3;
  font-size: 12px;
  font-weight: 600;
}

footer span {
  margin: 0.4rem auto;
}
</style>
