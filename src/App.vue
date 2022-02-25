<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRoute } from 'vue-router';
import EmptyLayout from './components/layouts/EmptyLayout.vue';

export default defineComponent({
  name: 'App',
  components: {
    EmptyLayout,
  },
  setup() {
    const layout = computed(() => {
      const route = useRoute();

      const layoutTag = (route.meta && route.meta.layout) || 'empty';

      return `${layoutTag}-layout`;
    });

    return {
      layout,
    };
  },
});
</script>

<style lang="scss">
@import '@/scss/root.scss';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--qa-color-font-dark);
  height: 100%;
}
body,
html {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  & > {
    div,
    section,
    aside {
      background-color: var(--qa-color-background);
    }
  }
}
</style>
