<template>
  <div class="qa-select-verse-range">
    <Range
      v-model="selectedRoughIndex"
      :tooltip="roughTooltip"
      :min="0"
      :max="verses.length - 1"
    >
      <template v-slot:label>rough</template>
    </Range>
    <Range
      v-model="selectedFineIndex"
      :tooltip="fineTooltip"
      :min="0"
      :max="fineVerses.length - 1"
    >
      <template v-slot:label>fine</template>
    </Range>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store/store';
import { computed, defineComponent, ref, watch } from 'vue';
import Range from '@/components/form/Range.vue';
import { referenceToString } from '@/utilities/utilityFunctions';

const FINE_RANGE = 5;

export default defineComponent({
  name: 'QaSelectVerseRange',
  components: { Range },
  setup() {
    const store = useStore();

    const selectedRoughIndex = ref(0);
    const selectedFineIndex = ref(FINE_RANGE);

    watch(selectedRoughIndex, () => {
      selectedFineIndex.value = FINE_RANGE;
    });

    const verseList = computed(() => {
      return store.getters['session/verseList'];
    });

    const verses = computed(() => {
      return (verseList.value && verseList.value.verses) || [];
    });

    const roughTooltip = computed(() => {
      return (
        (verses.value.length > selectedRoughIndex.value &&
          referenceToString(verses.value[selectedRoughIndex.value])) ||
        selectedRoughIndex.value
      );
    });

    const fineVerses = computed(() => {
      const max = verses.value.length;

      let start = Math.max(selectedRoughIndex.value - FINE_RANGE, 0);
      let end = Math.min(selectedRoughIndex.value + FINE_RANGE + 1, max);

      if (start === 0 && end < max) {
        end = Math.min(FINE_RANGE * 2 + 1, max);
      } else if (end === max && start > 0) {
        start = Math.max(end - (FINE_RANGE * 2 + 1), 0);
      }

      return verses.value.slice(start, end);
    });

    const fineTooltip = computed(() => {
      return (
        (fineVerses.value.length > selectedFineIndex.value &&
          fineVerses.value[selectedFineIndex.value] &&
          referenceToString(fineVerses.value[selectedFineIndex.value])) ||
        selectedFineIndex.value
      );
    });

    return {
      verses,
      fineVerses,
      roughTooltip,
      fineTooltip,
      selectedRoughIndex,
      selectedFineIndex,
      store,
    };
  },
});
</script>

<style lang="scss">
.qa-select-verse-range {
}
</style>
