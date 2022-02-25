<template>
  <span class="material-icons qa-icon">{{ name }}</span>
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
  },
});
</script>

<style lang="scss">
.qa-icon {
  max-width: 1em;
  overflow: hidden;
  font-size: inherit;
  display: block;
}
</style>
