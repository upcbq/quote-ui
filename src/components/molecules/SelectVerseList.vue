<template>
  <div class="qa-select-verse-list" :class="{ faded: !vlYears.length }">
    <div class="flex row wrap justify-c qa-svl-select-container">
      <Select :disabled="!vlYears.length" v-model="selectedYear" class="col-xs-full">
        <template v-slot:label>Year</template>
        <option v-for="year in vlYears" :key="year" :value="year">
          {{ year }}
        </option>
        <option v-if="!vlYears.length">
          <PlaceholderText :length="3" />
        </option>
      </Select>
      <Select
        :disabled="!vlDivisions.length"
        v-model="selectedDivision"
        class="col-xs-full"
      >
        <template v-slot:label>Division</template>
        <option v-for="division in vlDivisions" :key="division" :value="division">
          {{ division }}
        </option>
        <option v-if="!vlDivisions.length">
          <PlaceholderText :length="4" />
        </option>
      </Select>
    </div>
    <p class="qa-svl-name">
      {{ selectedVl?.name
      }}<PlaceholderText v-if="!selectedVl" :length="8"></PlaceholderText>
    </p>
    <p>
      {{ selectedVl?.count }}
      <PlaceholderText v-if="!selectedVl" :length="2"></PlaceholderText>
      verses
    </p>
    <Button
      class="qa-svl-select-button"
      :disabled="!selectedVl"
      @click.prevent="$emit('select', selectedVl)"
    >
      <Icon name="chevron_right" />
    </Button>
  </div>
  <Spinner class="qa-svl-spinner" v-if="!vlYears.length" :delay="0" />
</template>

<script lang="ts">
import { useStore } from '@/store/store';
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { DIVISION_ORDER } from '@/constants/divisions';
import Select from '@/components/form/Select.vue';
import Icon from '@/components/content/Icon.vue';
import Button from '@/components/form/Button.vue';
import PlaceholderText from '@/components/form/PlaceholderText.vue';
import Spinner from '@/components/atoms/Spinner.vue';

export default defineComponent({
  name: 'QaSelectVerseList',
  components: {
    Select,
    Icon,
    Button,
    PlaceholderText,
    Spinner,
  },
  emits: ['select'],
  setup() {
    const store = useStore();

    const vlYears = computed(() =>
      (
        Array.from(
          store.state.verseList.verseLists.reduce((s, vl) => s.add(vl.year), new Set())
        ) as number[]
      )
        .sort()
        .reverse()
    );

    const selectedYear = ref<number>((vlYears.value && vlYears.value[0]) || -1);

    const vlDivisions = computed(() =>
      store.state.verseList.verseLists
        .filter((vl) => vl.year === selectedYear.value)
        .map((vl) => vl.division)
        .sort((a, b) => DIVISION_ORDER.indexOf(a) - DIVISION_ORDER.indexOf(b))
    );

    const selectedDivision = ref<string>(
      (vlDivisions.value && vlDivisions.value[0]) || ''
    );

    const selectedVl = computed(() =>
      store.state.verseList.verseLists.find(
        (vl) => vl.year === selectedYear.value && vl.division === selectedDivision.value
      )
    );

    watch([selectedYear], () => {
      if (!selectedVl.value) {
        selectedDivision.value = (vlDivisions.value && vlDivisions.value[0]) || '';
      }
    });

    onMounted(async () => {
      await store.dispatch('verseList/fetchVerseLists');
      selectedYear.value = (vlYears.value && vlYears.value[0]) || -1;
      selectedDivision.value = (vlDivisions.value && vlDivisions.value[0]) || '';
    });

    return {
      vlYears,
      selectedYear,
      vlDivisions,
      selectedDivision,
      selectedVl,
    };
  },
});
</script>

<style lang="scss">
.qa-select-verse-list {
  position: relative;
  .qa-svl-name {
    font-size: 36px;
    margin-top: 1em;
    @include media-smaller(xs) {
      font-size: 24px;
    }
  }
  .qa-svl-select-container {
    gap: 10px;
  }
  .qa-svl-select-button {
    font-size: 48px;
    padding: 5px 10px;
    margin-top: 20px;
    display: inline-flex;
    justify-content: center;
    text-align: center;
    @include media-smaller(xs) {
      font-size: 36px;
      width: 100%;
    }
  }
}
.qa-svl-spinner {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
