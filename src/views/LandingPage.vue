<template>
  <div class="wrapper">
    <h1>Spot-The-Pie</h1>
    <Box class="introduction">
      <p>Ever struggled choosing songs both you and your friends like?</p>
      <p>
        Generate a playlist with songs liked by both of you and push the party
        vibe to the next level!
      </p>
    </Box>
    <v-img
      :src="require('../assets/pie-intersection.svg')"
      class="illustration"
    />
    <Box class="callToAction">
      <p>
        Go to <a href="Spot-The-Pie.com" target="_blank">Spot-The-Pie.com</a> on
        your friend’s phone and enter your matching code there. (Or the other
        way around)
      </p>
      <div class="d-flex justify-center align-center">
        <p class="matchingCodeLabel">Friend's matching code:</p>
        <div class="matchingCodeContainer">
          <v-text-field
            class="shrink rounded-lg"
            @input="inputMatchingCode"
            single-line
            dense
            hide-details
            maxlength="6"
            solo
            type="text"
            background-color="#B3B3B3"
          />
        </div>
      </div>
      <p class="ownCode">
        Your matching code:
        <span v-if="myMatchingCode">{{ myMatchingCode }}</span>
        <span v-else> Loading... </span>
      </p>
    </Box>
    <h2>How to use Spot-The-Pie?</h2>
    <v-row>
      <v-col cols="6">
        <ol>
          <li>
            Enter your friend’s code on your device OR enter your code on your
            friend’s device.
          </li>
          <li>Both log in with their Spotify account on own device.</li>
          <li>Listen to the common playlist!</li>
        </ol>
      </v-col>
      <v-col cols="6">
        <v-img
          :src="require('../assets/commonPlaylist.png')"
          class="commonPlaylist"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Box from '../components/Box.vue';

export default Vue.extend({
  name: 'LandingPage',

  components: {
    Box,
  },
  data() {
    return {
      friendsMatchingCode: '000',
      myMatchingCode: '',
      interval: 0,
    };
  },
  beforeMount() {
    localStorage.removeItem('myMatchingCode');
    this.myMatchingCode = '';
  },
  mounted() {
    fetch(`${process.env.VUE_APP_BACKEND_URL}/myMatchingCode`)
      .then((response) => response.text())
      .then((response) => {
        this.myMatchingCode = response;
        localStorage.setItem('myMatchingCode', response);
      })
      .catch((error) => {
        console.error(error);
      });
    this.interval = setInterval(() => {
      const data = {
        myMatchingCode: this.myMatchingCode,
      };
      fetch(`${process.env.VUE_APP_BACKEND_URL}/amIMatched`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((matched) => {
          if (matched) {
            clearInterval(this.interval);
            this.$router.push('/login');
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }, 1000);
  },
  methods: {
    inputMatchingCode(codeInput: string) {
      if (codeInput.length < 6) {
        return;
      }
      const data = {
        myMatchingCode: this.myMatchingCode,
        friendsMatchingCode: codeInput.substring(0, 6),
      };
      fetch(`${process.env.VUE_APP_BACKEND_URL}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then((response) => {
        if (response.status !== 201) {
          console.error(response);
          return;
        }
        clearInterval(this.interval);
        this.$router.push('/login');
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.wrapper {
  padding: 40px;
}

.wrapper h1 {
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 24px;
}

.introduction {
  color: #b3b3b3;
}

.introduction p:nth-child(1) {
  margin-bottom: 4px;
}

.illustration {
  margin: 20px 10px;
}

.callToAction {
  color: #ffffff;
}

.callToAction a {
  color: #1bb954;
  text-decoration: none;
}

.matchingCodeLabel {
  font-size: 14px;
}

.matchingCodeContainer {
  width: 5rem;
  margin-left: 10px;
}

.ownCode {
  margin-top: 8px;
  margin-bottom: 4px;
  text-align: center;
  color: #b3b3b3;
}

.ownCode span {
  color: #1db954;
}

.wrapper h2 {
  margin-top: 20px;
  margin-bottom: 10px;
  font-size: 20px;
}

.wrapper ol li {
  list-style-position: inside;
  margin-bottom: 0.4rem;
  font-weight: 600;
  font-size: 15px;
  color: #b3b3b3;
}

.commonPlaylist {
  margin: 5px 15px 0 15px;
}
</style>
