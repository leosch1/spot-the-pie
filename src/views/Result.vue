<template>
  <div class="wrapper">
    <div v-if="playlistReady" class="wrapper"></div>
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
      fetch('http://localhost:3000/commonPlaylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((response) => {
        if (response.status !== 202) {
          console.error('An error occured');
          return;
        }
        console.log(response);
      });
    }
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
