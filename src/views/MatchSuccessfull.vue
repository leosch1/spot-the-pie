<template>
  <div class="wrapper">
    <h1>Successfull match!</h1>
    <Box class="info-box">
      <p>Only one more step!</p>
      <p>Please log in using your Spotify account.</p>
    </Box>
    <v-btn
      class="button spotify"
      color="#1db954"
      x-large
      :href="`${backendURL}/loginSpotify`"
    >
      Use Spotify
    </v-btn>
    <v-btn
      class="button appleMusic"
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

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    MusicKit: any; // TODO: Remove workaround
  }
}

export default Vue.extend({
  name: 'matchSuccessfull',
  components: {
    Box,
  },
  computed: {
    backendURL: () => process.env.VUE_APP_BACKEND_URL,
  },
  methods: {
    async loginWithAppleMusic() {
      const music = window.MusicKit.getInstance();
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
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wrapper h1 {
  margin-bottom: 1rem;
  font-weight: 600;
  font-size: 24px;
}

.info-box {
  color: #b3b3b3;
}

.button {
  &.spotify {
    margin-top: 2.2rem;
  }

  &.appleMusic {
    margin-top: 1.5rem;
  }
}
</style>
