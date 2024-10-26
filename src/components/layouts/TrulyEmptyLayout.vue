<template>
  <div class="truly-empty-layout">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TrulyEmptyLayout',
});
</script>

<style lang="scss">
.truly-empty-layout {
  width: 100%;
  height: 100%;
}
</style>
