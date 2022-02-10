<template>
  <div class="empty-layout">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EmptyLayout',
});
</script>

<style lang="scss">
.empty-layout {
  width: 100%;
  height: 100%;
}
</style>
