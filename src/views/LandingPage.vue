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
        Go to Spot-The-Pie.com on your friend’s phone and enter your matching
        code there. (Or the other way around)
      </p>
    </Box>
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
});
</script>

<style scoped>
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

.illustration {
  margin: 20px 10px;
}

.callToAction {
  color: #ffffff;
}
</style>
