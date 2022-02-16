<template>
  <div class="qa-home">
    <SessionSetup />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SessionSetup from '@/components/SessionSetup.vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    SessionSetup,
  },
});
</script>

<style lang="scss">
.qa-home {
}
</style>
