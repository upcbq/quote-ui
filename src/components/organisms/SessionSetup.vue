<template>
  <Card :elevation="4" class="qa-session-setup">
    <h2 class="font-h-2 text-left qa-ss-title">Session Setup</h2>
    <SelectVerseList v-if="state === 'selectVerseList'" @select="selectVerseList" />
    <SelectVerseRange v-else />
  </Card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SelectVerseList from '@/components/molecules/SelectVerseList.vue';
import SelectVerseRange from '@/components/molecules/SelectVerseRange.vue';
import Card from '@/components/content/Card.vue';
import { VerseListLimitedResponse } from '@/api/modules/verseList/verseListApi.interfaces';
import { useStore } from '@/store/store';

export default defineComponent({
  name: 'SessionSetup',
  data: () => ({
    state: 'selectVerseList' as 'selectVerseList' | 'selectRange',
  }),
  methods: {
    async selectVerseList(verseList: VerseListLimitedResponse) {
      const store = useStore();
      store.commit('session/setSelectedVerseListId', verseList._id);
      await store.dispatch('session/fetchVerseList');
      this.state = 'selectRange';
    },
  },
  components: {
    SelectVerseList,
    Card,
    SelectVerseRange,
  },
});
</script>

<style lang="scss">
.qa-session-setup {
  width: calc(100% - 40px);
  box-sizing: border-box;
  max-width: 800px;
  .qa-ss-title {
    margin-bottom: 1em;
  }
}
</style>
