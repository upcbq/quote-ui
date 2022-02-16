<template>
  <div class="empty-layout">
    <div class="test-links">
      <router-link
        v-for="link in availableLinks"
        :key="link.to"
        :to="link.to"
        class="test-link"
        >{{ link.label }}</router-link
      >
    </div>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EmptyLayout',
  data: () => ({
    links: [
      {
        to: '/record',
        label: 'recording test',
      },
      {
        to: '/',
        label: 'home',
      },
    ] as Array<{ to: string; label: string }>,
  }),
  computed: {
    availableLinks(): Array<{ to: string; label: string }> {
      return this.links.filter((l) => l.to !== this.$route.fullPath);
    },
  },
});
</script>

<style lang="scss">
.empty-layout {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .test-links {
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 5px 0;

    .test-link:not(:last-child) {
      margin-right: 10px;
      padding-right: 10px;
      position: relative;
      box-sizing: border-box;
      &:after {
        content: '';
        position: absolute;
        height: 60%;
        width: 1px;
        background-color: var(--qa-color-border);
        left: 100%;
        top: 20%;
      }
    }
  }
}
</style>
