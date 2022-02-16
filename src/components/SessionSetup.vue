<template>
  <div class="qa-session-setup">
    <Select v-if="vlYears.length" v-model="selectedYear">
      <option v-for="year in vlYears" :key="year" :value="year">
        {{ year }}
      </option>
    </Select>
    <Select v-if="vlDivisions.length" v-model="selectedDivision">
      <option v-for="division in vlDivisions" :key="division" :value="division">
        {{ division }}
      </option>
    </Select>
    <p v-if="selectedVl">{{ selectedVl?.name }}</p>
    <p v-if="selectedVl">{{ selectedVl?.count }} verses</p>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store/store';
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { DIVISION_ORDER } from '@/constants/divisions';
import Select from './form/Select.vue';

export default defineComponent({
  name: 'QaSessionSetup',
  components: {
    Select,
  },
  setup() {
    const store = useStore();

    const vlYears = computed(() =>
      (Array.from(
        store.state.verseList.verseLists.reduce((s, vl) => s.add(vl.year), new Set())
      ) as number[])
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
.qa-session-setup {
}
</style>
