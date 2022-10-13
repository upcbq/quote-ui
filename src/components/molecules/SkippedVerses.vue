<template>
  <div class="qa-skipped-verses flex col">
    <h3>skipped verses</h3>
    <div class="qa-sv-unskip-all margin-center flex row justify-space-b">
      <Button
        text
        @click.prevent="clearSelection()"
        :class="{ invisible: !selected.length }"
        >clear selection</Button
      >
      <Button text @click.prevent="unskipAll()"
        >unskip {{ selected.length > 0 ? 'selected' : 'all' }}</Button
      >
    </div>
    <div class="grow-1 scroll-y">
      <div class="qa-sv-verses margin-center h-100">
        <div
          v-for="(s, i) in skipped"
          :key="`skipped-${s.display}`"
          class="qa-sv-verse flex row justify-space-b align-c"
          :class="{ selected: s.selected }"
          @click.prevent="s.selected ? deselect(i) : select(i, $event)"
        >
          <span>{{ s.display }}</span>
          <Button text @click.prevent.stop="unskip(s.index)" class="qa-sv-unskip-button"
            >unskip</Button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store/store';
import { referenceToString } from '@/utilities/utilityFunctions';
import { computed } from '@vue/reactivity';
import { defineComponent, ref } from 'vue';
import Button from '@/components/form/Button.vue';

export default defineComponent({
  name: 'SkippedVerses',
  props: {},
  setup() {
    const store = useStore();
    const selected = ref<number[]>([]);
    const skipped = computed(() => {
      return store.getters['session/skippedVerses']
        .map((v) => ({
          ...v,
          display: referenceToString(v),
        }))
        .sort((s1, s2) => s1.index - s2.index)
        .map((v, i) => ({
          ...v,
          selected: selected.value.includes(i),
        }));
    });
    function unskip(index: number) {
      store.dispatch('session/unskipVerse', index);
      clearSelection();
    }
    function unskipAll() {
      if (selected.value.length) {
        selected.value
          .map((v) => skipped.value.at(v)?.index)
          .forEach((index) => store.dispatch('session/unskipVerse', index));
        clearSelection();
        return;
      }
      skipped.value.forEach(({ index }) => store.dispatch('session/unskipVerse', index));
      clearSelection();
    }
    function select(index: number, event?: MouseEvent) {
      if (event?.shiftKey) {
        return selectRange(index);
      }
      if (!selected.value.includes(index)) {
        selected.value.push(index);
      }
    }
    function deselect(index: number) {
      if (selected.value.includes(index)) {
        selected.value.splice(selected.value.indexOf(index), 1);
      }
    }
    function selectRange(index: number) {
      const lastSelected = selected.value.at(-1);
      if (lastSelected !== undefined) {
        const min = Math.min(lastSelected, index);
        const max = Math.max(lastSelected, index);

        const toSelect = skipped.value
          .map((s, i) => i)
          .filter((i) => i <= max && i >= min);
        toSelect.forEach((i) => select(i));
      } else {
        select(index);
      }
    }
    function clearSelection() {
      selected.value = [];
    }

    return {
      skipped,
      unskip,
      unskipAll,
      select,
      deselect,
      selected,
      clearSelection,
    };
  },
  components: { Button },
});
</script>

<style lang="scss">
.qa-skipped-verses-overlay {
  width: 85%;
  height: 90%;
  background: var(--qa-color-white);
  border-radius: var(--qa-border-radius);
  box-sizing: border-box;
  @include media-larger(sm) {
    max-width: 85vw;
    max-height: 90vh;
  }
}
.qa-skipped-verses {
  box-sizing: border-box;
  height: 100%;
  padding: 10px 20px;

  .qa-sv-verses,
  .qa-sv-unskip-all {
    width: 100%;
    max-width: 500px;
  }

  .qa-sv-unskip-all {
    padding: 10px;
    box-sizing: border-box;
    border-bottom: 1px solid var(--qa-color-border);
  }

  .qa-sv-verses {
    text-align: left;
    user-select: none;
  }

  .qa-sv-unskip-button {
    padding: 10px;
  }

  .qa-sv-verse {
    padding-left: 10px;
    box-sizing: border-box;
    cursor: pointer;
    &:not(:last-child) {
      border-bottom: 1px solid var(--qa-color-border);
    }

    &:hover {
      background-color: var(--qa-color-white--darken-10);
    }

    &.selected {
      background-color: var(--qa-color-primary--lighten-30);

      &:hover {
        background-color: var(--qa-color-primary--lighten-20);
      }
    }
  }
}
</style>
