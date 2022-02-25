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
  width: 100%;
  min-height: 100%;
  padding: 30px 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
  .qa-test-card {
    width: calc(100% - 40px);
    box-sizing: border-box;
    max-width: 800px;
  }
}
</style>
