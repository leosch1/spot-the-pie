<template>
  <div class="wrapper">
    <div
      v-if="commonPlaylistIdentifier"
      class="d-flex justify-center align-center commonPlaylistWrapper"
    >
      <div
        v-if="commonPlaylistIdentifier === 'EMPTY'"
        class="d-flex flex-column"
      >
        <h1>No common tracks. 😢</h1>
        <v-btn class="button accent--text" x-large to="/">Start Again</v-btn>
      </div>
      <div
        v-else-if="musicApi === 'SPOTIFY'"
        class="d-flex flex-column align-center"
      >
        <h1>Yeah! Common tracks found! 🥳</h1>
        <v-btn
          class="button spotify"
          color="#1db954"
          x-large
          :href="`https://open.spotify.com/playlist/${commonPlaylistIdentifier}`"
          target="_blank"
          >Open Playlist</v-btn
        >
        <!-- TODO: The embed widget is not always immediately available after creation. -->
        <!-- <iframe
          :src="`https://open.spotify.com/embed/playlist/${commonPlaylistIdentifier}`"
          width="300"
          height="380"
          frameborder="0"
          allowtransparency="true"
          allow="encrypted-media"
        ></iframe> -->
      </div>
      <!-- <div TODO: Put back in
        v-else-if="musicApi === 'APPLE_MUSIC'"
        class="d-flex flex-column align-center"
      >
        <h1>Yeah! Common tracks found! 🥳</h1>
        <v-btn
          class="button appleMusic"
          color="#eeeef0"
          x-large
          :href="`https://music.apple.com/library/playlist/${commonPlaylistIdentifier}`"
          target="_blank"
        >
          Open Playlist
        </v-btn>
      </div> -->
    </div>
    <div
      v-else-if="generatingPlaylist"
      class="d-flex flex-column justify-center align-center"
    >
      <h1>Generating playlist... 🔥</h1>
      <v-progress-linear v-model="progress" />
    </div>
    <div v-else-if="waitingForFriend">
      <h1>Waiting for your friend... 🙄</h1>
    </div>
    <div v-else-if="error">
      <h1>{{ error }} 😲</h1>
    </div>
    <div v-else class="d-flex flex-column justify-center align-center">
      <h1>Fetching your liked tracks... ⏳</h1>
      <v-progress-linear v-model="progress" />
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
  props: {
    musicApi: String,
    musicApiToken: String,
  },
  data() {
    return {
      generatingPlaylist: false,
      waitingForFriend: false,
      commonPlaylistIdentifier: '',
      interval: 0,
      intervalCounter: 0,
      intervalCounterMax: 600,
      error: '',
      progress: 0,
    };
  },
  mounted() {
    this.interval = setInterval(async () => {
      this.intervalCounter += 1;
      if (this.intervalCounter === this.intervalCounterMax) {
        clearInterval(this.interval);
      }
      const commonPlaylistResponse = await fetch(
        `${process.env.VUE_APP_BACKEND_URL}/commonPlaylist`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            myMatchingCode: sessionStorage.getItem('myMatchingCode'),
            musicApiToken: this.musicApiToken,
            musicApi: this.musicApi,
          }),
        },
      );

      console.info(commonPlaylistResponse);
      switch (commonPlaylistResponse.status) {
        case 213: {
          const data = await commonPlaylistResponse.json();
          this.progress = data.progress;
          break;
        }
        case 210:
          this.waitingForFriend = true;
          break;
        case 211: {
          this.generatingPlaylist = true;
          const data = await commonPlaylistResponse.json();
          this.progress = data.progress;
          break;
        }
        case 212:
          clearInterval(this.interval);
          this.commonPlaylistIdentifier = 'EMPTY';
          this.waitingForFriend = false;
          this.generatingPlaylist = false;
          break;
        case 200:
          clearInterval(this.interval);
          this.commonPlaylistIdentifier = await commonPlaylistResponse.text();
          this.waitingForFriend = false;
          this.generatingPlaylist = false;
          break;
        default:
          this.error = `Error ${commonPlaylistResponse.status} occured.`;
          break;
      }
    }, 1000);

    fetch(`${process.env.VUE_APP_BACKEND_URL}/fetchSavedTracks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        myMatchingCode: sessionStorage.getItem('myMatchingCode'),
        musicApi: this.musicApi,
        musicApiToken: this.musicApiToken,
      }),
    }).then((response) => {
      if (![200, 201].includes(response.status)) {
        clearInterval(this.interval);
        console.error(response);
      }
    });
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
  display: flex;
  flex-direction: column;
  justify-content: center;

  .commonPlaylistWrapper {
    height: 100%;
  }

  h1 {
    margin: 1rem 0;
    text-align: center;
    font-weight: 600;
    font-size: 24px;
  }

  .button {
    width: auto;

    &.spotify {
      margin-bottom: 1.5rem;
    }
  }
}
</style>
