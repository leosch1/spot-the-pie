<template>
  <div class="wrapper">
    <div v-if="commonPlaylistIdentifier" class="wrapper">
      <div v-if="commonPlaylistIdentifier === 'EMPTY'">
        <h1>No common tracks...😢</h1>
      </div>
      <!-- // TODO: Sometimes when Spotify is last, there is an error -->
      <div v-else-if="musicApi === 'SPOTIFY'">
        <iframe
          :src="`https://open.spotify.com/embed/playlist/${commonPlaylistIdentifier}?theme=0`"
          width="100%"
          height="380"
          frameBorder="0"
          allowfullscreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        ></iframe>
      </div>
      <div v-else-if="musicApi === 'APPLE_MUSIC'">
        <v-btn
          class="button appleMusic"
          rounded
          color="#EEEEF0"
          x-large
          :href="`https://music.apple.com/library/playlist/${commonPlaylistIdentifier}`"
          target="_blank"
        >
          Open Playlist on Apple Music
        </v-btn>
      </div>
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
      musicApi: '',
      musicApiToken: '',
      generatingPlaylist: false,
      waitingForFriend: false,
      commonPlaylistIdentifier: '',
      interval: 0,
      intervalCounter: 0,
      intervalCounterMax: 600,
    };
  },
  mounted() {
    const musicApi = this.$route.fullPath.match(/musicApi=([\w]+)/);
    const result = this.$route.fullPath.match(/access_token=([%-\w]+)/);
    if (result && musicApi) {
      [, this.musicApi] = musicApi;
      [, this.musicApiToken] = result;
      this.musicApiToken = decodeURIComponent(this.musicApiToken);
      fetch(`${process.env.VUE_APP_BACKEND_URL}/fetchSavedTracks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          myMatchingCode: localStorage.myMatchingCode,
          musicApi: this.musicApi,
          musicApiToken: this.musicApiToken,
        }),
      }).then((response) => {
        if (response.status !== 201) {
          console.error(response);
        } else {
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
                  myMatchingCode: localStorage.myMatchingCode,
                  musicApiToken: this.musicApiToken,
                  musicApi: this.musicApi,
                }),
              },
            );

            console.info(commonPlaylistResponse);
            switch (commonPlaylistResponse.status) {
              case 210:
                this.waitingForFriend = true;
                break;
              case 211:
                this.generatingPlaylist = true;
                break;
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
                break;
            }
          }, 1000);
        }
      });
    }
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
}

.wrapper h1 {
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 24px;
}
</style>
