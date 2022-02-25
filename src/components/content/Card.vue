<template>
  <div
    class="qa-card mdc-elevation--transition"
    :class="{ [`mdc-elevation--z${elevation}`]: true }"
  >
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'QaCard',
  props: {
    elevation: {
      type: Number,
      default: 0,
    },
  },
});
</script>

<style lang="scss">
.qa-card {
  border-radius: 5px;
  padding: 30px;
  background-color: var(--qa-color-white);

  @include media-smaller(xs) {
    padding: 15px;
  }
}
</style>
