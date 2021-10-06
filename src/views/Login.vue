<template>
  <div class="wrapper">
    <h1>Successfull match!</h1>
    <Box class="info-box">
      <p>Only one more step!</p>
      <p>Please log in using your Spotify account.</p>
    </Box>
    <div style="flex-grow: 1"></div>
    <v-img :src="require('../assets/running.gif')"> </v-img>
    <div style="flex-grow: 1"></div>
    <v-btn class="button" rounded color="#1db954" x-large href="http://localhost:3000/login">
      LOG IN WITH SPOTIFY
    </v-btn>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Box from '../components/Box.vue';

export default Vue.extend({
  name: 'Login',
  components: {
    Box,
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  height: 100%;
  padding: 40px;
  display: flex;
  flex-direction: column;
}

.wrapper h1 {
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 24px;
}

.info-box {
  color: #b3b3b3;
}

.button {
  align-self: center;
  font-weight: 600;
  color: #ffffff !important;
}
</style>
