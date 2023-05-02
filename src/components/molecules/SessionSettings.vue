<template>
  <div class="qa-session-settings">
    <h2 class="qa-ss-head">Settings</h2>
    <Toggle id="coach-mode-toggle" v-model="coachMode" title="coach mode">
      Coach Mode
    </Toggle>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import Toggle from '@/components/form/Toggle.vue';
import { useStore } from '@/store/store';

export default defineComponent({
  name: 'SessionSettings',
  components: { Toggle: Toggle },
  setup() {
    const store = useStore();
    const coachMode = computed({
      get: () => store.state.session.options.coachMode,
      set: (value: boolean) => store.commit('session/setCoachMode', value),
    });
    return {
      coachMode,
    };
  },
});
</script>

<style lang="scss">
.qa-session-settings-overlay {
  background: var(--qa-color-white);
  border-radius: var(--qa-border-radius);
  box-sizing: border-box;
  min-width: 250px;
}
.qa-session-settings {
  padding: 30px;

  .qa-ss-head {
    margin-top: 0;
    margin-bottom: 20px;
  }
}
</style>
