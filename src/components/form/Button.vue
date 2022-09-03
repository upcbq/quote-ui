<template>
  <button class="qa-button" :class="{ light, pill, text }">
    <slot />
  </button>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'QaButton',
  props: {
    light: {
      type: Boolean,
      default: false,
    },
    pill: {
      type: Boolean,
      default: false,
    },
    text: {
      type: Boolean,
      default: false,
    },
  },
});
</script>

<style lang="scss">
.qa-button {
  border-radius: var(--qa-border-radius);
  color: var(--qa-color-font);
  background-color: var(--qa-color-primary);
  cursor: pointer;
  transition: transition(background-color, color, 0.1s, ease-in-out);
  font-size: 20px;
  padding: 0.5em 1em;
  font-family: $qa-font-sans;

  &.light {
    border: 2px solid var(--qa-color-primary);
    color: var(--qa-color-font-dark);
    background-color: var(--qa-color-white);
    &:hover {
      background-color: var(--qa-color-white--darken-10);
    }
  }

  &.pill {
    border-radius: 1000px;
  }

  &.text {
    background: none;
    color: inherit;
    font-size: 1em;
    padding: 0;
    opacity: 0.7;

    &:hover {
      background: none;
      opacity: 1;
    }
  }

  &:hover {
    background-color: var(--qa-color-primary--darken-10);
  }

  &:disabled {
    background-color: var(--qa-color-disabled);
  }
}
</style>
