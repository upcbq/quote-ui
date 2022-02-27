<template>
  <div class="qa-select-verse-range">
    <h3 class="qa-svr-title">Final verse</h3>
    <p class="qa-svr-last-verse">
      {{ fineTooltip }}
      <PlaceholderText v-if="!fineTooltip" :length="4" />
    </p>
    <Range
      v-model="selectedRoughIndex"
      :tooltip="roughTooltip"
      :min="0"
      :max="verses.length - 1"
    >
      <template v-slot:label>Rough</template>
    </Range>
    <Range
      v-model="selectedFineIndex"
      :tooltip="fineTooltip"
      :min="0"
      :max="fineVerses.length - 1"
      v-if="showFine"
    >
      <template v-slot:label>Fine</template>
    </Range>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store/store';
import { computed, defineComponent, ref, watch } from 'vue';
import Range from '@/components/form/Range.vue';
import { referenceToString } from '@/utilities/utilityFunctions';
import PlaceholderText from '@/components/form/PlaceholderText.vue';

const FINE_RANGE = 5;

export default defineComponent({
  name: 'QaSelectVerseRange',
  components: { Range, PlaceholderText },
  setup() {
    const store = useStore();

    const selectedRoughIndex = ref(0);
    const selectedFineIndex = ref(0);

    const verseList = computed(() => {
      return store.getters['session/verseList'];
    });

    const verses = computed(() => {
      return (verseList.value && verseList.value.verses) || [];
    });

    const showFine = computed(() => {
      return !verses.value || verses.value.length > FINE_RANGE * 2;
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

    const selectedVerse = computed(() => {
      return (
        fineVerses.value.length > selectedFineIndex.value &&
        fineVerses.value[selectedFineIndex.value]
      );
    });

    const fineTooltip = computed(() => {
      return (
        (selectedVerse.value && referenceToString(selectedVerse.value)) ||
        selectedFineIndex.value
      );
    });

    watch(selectedRoughIndex, () => {
      if (selectedRoughIndex.value + FINE_RANGE > verses.value.length) {
        selectedFineIndex.value =
          FINE_RANGE * 2 - (verses.value.length - 1 - selectedRoughIndex.value);
      } else if (selectedRoughIndex.value < FINE_RANGE) {
        selectedFineIndex.value = selectedRoughIndex.value;
      } else {
        selectedFineIndex.value = FINE_RANGE;
      }
    });

    // Add something on mounted to check user's previous session final verse and set to selectedRoughIndex

    return {
      verses,
      fineVerses,
      roughTooltip,
      fineTooltip,
      selectedRoughIndex,
      selectedFineIndex,
      selectedVerse,
      showFine,
    };
  },
});
</script>

<style lang="scss">
.qa-select-verse-range {
  .qa-svr-last-verse {
    font-size: 36px;
    margin-bottom: 48px;
  }
  .qa-svr-title {
    font-size: 18px;
    letter-spacing: -0.1;
    margin-bottom: -10px;
    color: var(--qa-color-border);
  }
  @include media-smaller(xs) {
    .qa-svr-last-verse {
      font-size: 24px;
    }
    .qa-svr-title {
      font-size: 16px;
    }
  }
}
</style>
