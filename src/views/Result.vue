<template>
  <div class="wrapper">
    <div v-if="playlistReady" class="wrapper">
      <iframe
        src="https://open.spotify.com/embed/playlist/3pLwPBzW6OzE7tS7JtOl1h?theme=0"
        width="100%"
        height="380"
        frameBorder="0"
        allowfullscreen=""
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      ></iframe>
    </div>
    <div v-else-if="generatingPlaylist"></div>
    <div v-else>
      <h1>Waiting for your friend to log in..</h1>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Result',
  components: {},
  data() {
    return {
      playlistReady: false,
      generatingPlaylist: false,
    };
  },
  mounted() {
    const result = this.$route.hash.match(/access_token=([-\w]+)/);
    if (result) {
      const accessToken = result[1];
      const data = {
        myMatchingCode: localStorage.myMatchingCode,
        spotifyAccessToken: accessToken,
      };
      fetch('http://localhost:3000/generatePlaylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((response) => {
        if (response.status !== 202) {
          console.error(response);
          return;
        }
        console.log(response.status);
      });
    }
  },
  created() {
    const interval = setInterval(async () => {
      const data = {
        myMatchingCode: localStorage.myMatchingCode,
      };
      const response = await fetch('http://localhost:3000/commonPlaylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      switch (response.status) {
        case 210:
          console.log('210 WAITING_FOR_FRIEND_LOGIN');
          break;
        case 211:
          console.log('211 GENERATING_PLAYLIST');
          this.generatingPlaylist = true;
          break;
        case 200:
          clearInterval(interval);
          console.log(await response.text());
          this.generatingPlaylist = false;
          this.playlistReady = true;
          break;
        default:
          break;
      }
    }, 1000);
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
