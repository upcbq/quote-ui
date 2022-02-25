<template>
  <button class="qa-button">
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'QaButton',
});
</script>

<style lang="scss">
.qa-button {
  border-radius: var(--qa-border-radius);
  color: var(--qa-color-font);
  background-color: var(--qa-color-primary);
  cursor: pointer;
  transition: transition(background-color, color, 0.1s, ease-in-out);

  &:hover {
    background-color: var(--qa-color-primary--darken-10);
  }

  &:disabled {
    background-color: var(--qa-color-disabled);
  }
}
</style>
