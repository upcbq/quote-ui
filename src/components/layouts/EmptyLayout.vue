<template>
  <div class="empty-layout">
    <div class="header-links">
      <router-link
        v-for="link in availableLinks"
        :key="link.to"
        :to="link.to"
        class="header-link"
        >{{ link.label }}</router-link
      >
    </div>
    <div class="el-content">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'EmptyLayout',
  data: () => ({
    links: [] as Array<{ to: string; label: string }>,
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

  .header-links {
    width: 100%;
    justify-self: flex-start;
    display: flex;
    flex-grow: 0;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 5px 0;

    .header-link:not(:last-child) {
      margin-right: 10px;
      padding-right: 10px;
      position: relative;
      box-sizing: border-box;
      &:after {
        content: '';
        position: absolute;
        height: 60%;
        width: 1px;
        left: 100%;
        top: 20%;
      }
    }
  }

  .el-content {
    width: 100%;
    flex-grow: 1;
    overflow-y: auto;
    display: flex;

    & > * {
      flex-grow: 1;
    }
  }
}
</style>
