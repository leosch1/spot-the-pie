<template>
  <v-app>
    <v-main class="main">
      <router-view/>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'App',

  data: () => ({
    //
  }),
});
</script>

<style>
.main {
  background-color: #282828;
  color: #ffffff;
  font-family: "Montserrat" !important;
}

.v-application .main * {
  margin: 0;
  padding: 0;
}
</style>
