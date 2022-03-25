<template>
  <div class="qa-session-controls">
    <template v-if="mode === 'quote'">
      <IconButton
        :icon="shuffle ? 'shuffle_on' : 'shuffle'"
        @click.prevent="shuffle = !shuffle"
        :title="`turn shuffle ${shuffle ? 'off' : 'on'}`"
      >
      </IconButton>
      <RecordButton icon="fiber_manual_record" class="qa-sc-rec-button" border>
        REC
      </RecordButton>
      <IconButton
        @click.prevent="skip(currentIndex)"
        icon="skip_next"
        title="skip current verse"
      >
      </IconButton>
    </template>
    <template v-else-if="mode === 'review'"> Review controls </template>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store/store';
import { computed, defineComponent } from 'vue';
import IconButton from '@/components/molecules/IconButton.vue';
import RecordButton from '@/components/molecules/RecordButton.vue';

export default defineComponent({
  name: 'SessionControls',
  components: { IconButton, RecordButton },
  props: {
    mode: {
      type: String,
    },
    currentIndex: {
      type: Number,
      default: -1,
    },
  },
  setup() {
    const store = useStore();
    const shuffle = computed({
      get: () => store.state.session.shuffle,
      set: (value) => store.dispatch('session/shuffle', value),
    });

    function skip(index: number) {
      store.dispatch('session/skipVerse', index);
    }

    return {
      shuffle,
      skip,
    };
  },
});
</script>

<style lang="scss">
.qa-session-controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
</style>
