<template>
  <div class="qa-session-settings flex col gap-20">
    <h2 class="qa-ss-head">Settings</h2>
    <Toggle id="coach-mode-toggle" v-model="coachMode" title="coach mode">
      Coach Mode
    </Toggle>
    <QaButton
      @click.prevent="openCardDisplay"
      v-if="coachMode"
      title="Opens a separate window showing just the reference for screen sharing"
    >
      Open Card
    </QaButton>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import Toggle from '@/components/form/Toggle.vue';
import { useStore } from '@/store/store';
import QaButton from '@/components/form/Button.vue';
import { PATH } from '@/router/router';

export default defineComponent({
  name: 'SessionSettings',
  components: { Toggle: Toggle, QaButton },
  setup() {
    const store = useStore();
    const coachMode = computed({
      get: () => store.state.session.options.coachMode,
      set: (value: boolean) => store.commit('session/setCoachMode', value),
    });
    function openCardDisplay() {
      window.open(
        PATH.viewCard,
        '_blank',
        'location=yes,height=300,width=600,scrollbars=no,status=no'
      );
    }
    return {
      coachMode,
      openCardDisplay,
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
    margin: 0;
  }
}
</style>
