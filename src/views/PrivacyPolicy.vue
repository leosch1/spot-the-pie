<template>
  <div class="wrapper">
    <h1>Privacy Policy</h1>
    <p>
      <span>Common-Pie</span> only stores your personal data up to 60 minutes.
      It is automatically deleted afterwards.
    </p>
    <p>
      Personally identifying information is not shared publicly or with
      third-parties, except when required to by law.
    </p>
    <p>
      Common-Pie may link to external sites that are operated by others.
      Please be aware that Common-Pie has no control over the content and practices of
      these sites, and cannot accept responsibility or liability for their
      respective privacy policies.
    </p>
    <p>
      Your continued use of the website will be regarded as acceptance of
      practices around privacy and personal information on Common-Pie.
    </p>
    <p>This policy is effective as of 19 November 2021.</p>
  </div>
</template>

<script>
import Vue from 'vue';

export default Vue.extend({
  name: 'PrivacyPolicy',
});
</script>

<style lang="scss" scoped>
h1 {
  margin-bottom: 1rem;
}

p {
  margin-bottom: 0.5rem !important;
  span {
    color: #1bb954;
  }
}
</style>
