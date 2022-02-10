<template>
  <span class="material-icons" :style="{ color: color }">{{ name }}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'QaIcon',
  props: {
    name: {
      type: String,
      default: '',
    },
    color: {
      type: String,
      default: '#000',
    },
  },
});
</script>
