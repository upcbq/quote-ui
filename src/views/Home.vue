<template>
  <div class="qa-home">
    <Record></Record>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Record from '@/components/Record/Record.vue';

export default defineComponent({
  name: 'HomeView',
  components: {
    Record,
  },
});
</script>
