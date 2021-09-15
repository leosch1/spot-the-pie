<template>
  <div class="wrapper">
    <h1>You're almost done!</h1>
    <Box class="login">
      <p>The last step is for you and your friends to now log in with your spotify account</p>
    </Box>
    <div class="buttonWrapper">
    <v-btn class="loginS"
      rounded
      color="green"
      x-large
    >LOG IN WITH SPOTIFY</v-btn>
    </div>
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

<style scoped>
.wrapper {
  padding: 10px;
}

.wrapper h1 {
  margin: 20px 10px 10px 10px;
  font-weight: 600;
  font-size: 24px;
}

.login {
  font-family: "Montserrat" !important;
  margin: 10px 0px 40px 0px;
  color: #b3b3b3;
  font-style: normal;
  font-weight: 600;
  font-size: 18px;
  line-height: 22px;

}

.loginS {
  color: #ffffff !important;
  font-style: normal;
}

.buttonWrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
