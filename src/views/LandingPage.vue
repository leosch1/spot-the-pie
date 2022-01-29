<template>
  <div class="wrapper">
    <h1>Common-Pie</h1>
    <Box class="introduction">
      <p>Struggling choosing songs both you and your friends like?</p>
      <p>
        Common-Pie generates a <span>Common Playlist</span> with songs liked by
        both!
      </p>
    </Box>
    <v-img
      :src="require('../assets/pie-intersection.svg')"
      class="illustration"
    />
    <Box class="callToAction">
      <p>
        Go to
        <a href="https://common-pie.schleo.com" target="_blank"
          >Common-Pie.schleo.com</a
        >
        on your friend’s phone and enter your matching code there. (By doing
        that you agree to the
        <router-link class="privacyPolicyLink" to="/privacyPolicy">
          <u>Privacy Policy</u>
        </router-link>.)
      </p>
      <div class="d-flex justify-center align-center my-1">
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

    <div class="logos">
      <v-img contain :src="require('../assets/spotify-logo.svg')" />
      <div class="spacer"></div>
      <v-img contain :src="require('../assets/apple-music-logo.svg')" />
    </div>

    <h2>How to use Common-Pie?</h2>
    <v-row>
      <v-col cols="7">
        <ol>
          <li>Match with code</li>
          <li>Login to Spotify or Apple Music</li>
          <li>Listen!</li>
        </ol>
      </v-col>
      <v-col cols="5">
        <v-img
          :src="require('../assets/common-playlist.png')"
          class="commonPlaylist"
        />
      </v-col>
    </v-row>
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
      intervalCounter: 0,
      intervalCounterMax: 600,
    };
  },
  beforeMount() {
    sessionStorage.removeItem('myMatchingCode');
    this.myMatchingCode = '';
  },
  async mounted() {
    const matchingCodeResponse = await fetch(
      `${process.env.VUE_APP_BACKEND_URL}/myMatchingCode`,
    );
    this.myMatchingCode = await matchingCodeResponse.text();
    sessionStorage.setItem('myMatchingCode', this.myMatchingCode); // TODO: Replace with cookie
    sessionStorage.setItem('matched', 'false');

    this.interval = setInterval(async () => {
      this.intervalCounter += 1;
      if (this.intervalCounter === this.intervalCounterMax) {
        clearInterval(this.interval);
      }
      const data = {
        myMatchingCode: this.myMatchingCode,
      };
      const response = await fetch(
        `${process.env.VUE_APP_BACKEND_URL}/amIMatched`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        },
      );

      if (response.status !== 200) {
        return;
      }
      const matched = await response.json();
      if (matched) {
        sessionStorage.setItem('matched', 'true');
        this.$router.push('/matchSuccessful');
        clearInterval(this.interval);
      }
    }, 1000);
  },
  methods: {
    refreshPage() {
      window.location.reload();
    },
    inputMatchingCode(codeInput: string) {
      if (codeInput.length < 6) {
        return;
      }
      const data = {
        matchingCodes: [this.myMatchingCode, codeInput.substring(0, 6)],
      };
      if (data.matchingCodes[0] === data.matchingCodes[1]) {
        return; // TODO: Display error message
      }
      clearInterval(this.interval);
      fetch(`${process.env.VUE_APP_BACKEND_URL}/match`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      }).then(async (response) => {
        if (response.status !== 201) {
          console.error(await response.text());
          return;
        }
        sessionStorage.setItem('matched', 'true');
        this.$router.push('/matchSuccessful');
      });
    },
  },
});
</script>

<style lang="scss" scoped>
.wrapper h1 {
  margin-bottom: 20px;
  font-weight: 600;
  font-size: 24px;
}

.introduction {
  color: #b3b3b3;

  p:nth-child(1) {
    margin-bottom: 6px;
  }

  p span {
    color: #1bb954;
  }
}

.illustration {
  margin: 2px 0 30px 0;
}

.callToAction {
  background-color: #5028f0;
  color: #ffffff;
}

.callToAction a {
  color: #1bb954;
  text-decoration: none;
}

.callToAction .privacyPolicyLink {
  color: white;
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

.logos {
  width: 200px;
  display: flex;
  align-items: center;
  margin: 20px auto;

  .spacer {
    width: 20px;
  }
}

.wrapper h2 {
  margin: 30px 0 10px 0;
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
  margin-top: 5px;
}
</style>
