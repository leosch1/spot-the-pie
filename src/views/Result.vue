<template>
  <div class="wrapper">
    <div v-if="playlistURI" class="wrapper">
      <iframe
        :src="`https://open.spotify.com/embed/playlist/${playlistURI}?theme=0`"
        width="100%"
        height="380"
        frameBorder="0"
        allowfullscreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      ></iframe>
    </div>
    <div v-else-if="generatingPlaylist">
      <h1>Generating playlist..</h1>
    </div>
    <div v-else-if="waitingForFriend">
      <h1>Waiting for your friend to log in..</h1>
    </div>
    <div v-else class="text-center">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
    </div>
    <v-snackbar :value="intervalCounter === intervalCounterMax" :timeout="-1">
      <span class="mx-3">Timeout, Please refresh the page.</span>
      <template>
        <v-btn color="#1bb954" small text @click="refreshPage">Refresh</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Result',
  components: {},
  data() {
    return {
      spotifyAccessToken: '',
      generatingPlaylist: false,
      waitingForFriend: false,
      playlistURI: '',
      interval: 0,
      intervalCounter: 0,
      intervalCounterMax: 1,
    };
  },
  mounted() {
    const result = this.$route.hash.match(/access_token=([-\w]+)/);
    if (result) {
      [, this.spotifyAccessToken] = result;
      const data = {
        myMatchingCode: localStorage.myMatchingCode,
        spotifyAccessToken: this.spotifyAccessToken,
      };
      fetch(`${process.env.VUE_APP_BACKEND_URL}/generatePlaylist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((response) => {
        if (response.status !== 202) {
          console.error(response);
        }
      });
    }
    this.interval = setInterval(async () => {
      this.intervalCounter += 1;
      if (this.intervalCounter === this.intervalCounterMax) {
        clearInterval(this.interval);
      }
      const data = {
        myMatchingCode: localStorage.myMatchingCode,
        spotifyAccessToken: this.spotifyAccessToken,
      };
      const response = await fetch(
        `${process.env.VUE_APP_BACKEND_URL}/commonPlaylist`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        },
      );

      switch (response.status) {
        case 210:
          this.waitingForFriend = true;
          break;
        case 211:
          this.generatingPlaylist = true;
          break;
        case 200:
          clearInterval(this.interval);
          this.playlistURI = await response.text();
          this.waitingForFriend = false;
          this.generatingPlaylist = false;
          break;
        default:
          break;
      }
    }, 1000);
  },
  methods: {
    refreshPage() {
      window.location.reload();
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
</style>
