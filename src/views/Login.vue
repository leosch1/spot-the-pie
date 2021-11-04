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
    <v-btn
      class="button spotify"
      rounded
      color="#1db954"
      x-large
      :href="`${backendURL}/loginSpotify`"
    >
      Use Spotify
    </v-btn>
    <v-btn
      class="button appleMusic"
      rounded
      color="#EEEEF0"
      x-large
      @click="loginWithAppleMusic"
    >
      Use Apple Music
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
  computed: {
    backendURL: () => process.env.VUE_APP_BACKEND_URL,
  },
  methods: {
    async loginWithAppleMusic() {
      // eslint-disable-next-line no-undef
      const music = MusicKit.getInstance(); // TODO: Fix 'Cannot find'
      const token: string = await music.authorize();
      if (token && token.length) {
        this.$router.push(
          `/result?musicApi=APPLE_MUSIC&access_token=${encodeURIComponent(
            token,
          )}`,
        );
      }
    },
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
</style>
