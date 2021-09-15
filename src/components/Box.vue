<template>
  <div class="box">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'Box',
  data: () => ({}),
});
</script>

<style scoped>
.box {
  background-color: #181818;
  border-radius: 5px;
  padding: 10px 15px;
  margin: 0 -15px;
  font-weight: 600;
  font-size: 13px;
}

</style>
