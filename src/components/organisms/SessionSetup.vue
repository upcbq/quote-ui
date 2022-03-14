<template>
  <Card :elevation="4" class="qa-session-setup">
    <Button
      class="qa-ss-back-button"
      v-if="state !== 'selectVerseList'"
      @click.prevent="state = 'selectVerseList'"
    >
      <Icon name="arrow_back"></Icon>
    </Button>
    <h2 class="font-h-2 text-left qa-ss-title">Session Setup</h2>
    <SelectVerseList v-if="state === 'selectVerseList'" @select="selectVerseList" />
    <SelectVerseRange v-else @select="selectVerseRange" />
  </Card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SelectVerseList from '@/components/molecules/SelectVerseList.vue';
import SelectVerseRange from '@/components/molecules/SelectVerseRange.vue';
import Card from '@/components/content/Card.vue';
import { VerseListLimitedResponse } from '@/api/modules/verseList/verseListApi.interfaces';
import { useStore } from '@/store/store';
import Button from '@/components/form/Button.vue';
import Icon from '@/components/content/Icon.vue';
import { useRouter } from 'vue-router';
import { PATH } from '@/router/router';

export default defineComponent({
  name: 'SessionSetup',
  setup() {
    const store = useStore();

    const router = useRouter();

    const state = ref<'selectVerseList' | 'selectRange'>('selectVerseList');

    async function selectVerseList(verseList: VerseListLimitedResponse) {
      store.commit('session/setSelectedVerseListId', verseList._id);
      await store.dispatch('session/fetchVerseList');
      state.value = 'selectRange';
    }

    async function selectVerseRange(finalVerseIndex: number) {
      store.commit('session/setFinalVerseIndex', finalVerseIndex);
      store.commit('session/resetComplete');
      router.push(PATH.quote);
    }

    return {
      state,
      selectVerseList,
      selectVerseRange,
    };
  },
  components: {
    SelectVerseList,
    Card,
    SelectVerseRange,
    Button,
    Icon,
  },
});
</script>

<style lang="scss">
.qa-session-setup {
  width: calc(100% - 40px);
  box-sizing: border-box;
  max-width: 800px;
  position: relative;
  .qa-ss-title {
    margin-bottom: 1em;
  }
  .qa-ss-back-button {
    position: absolute;
    background: transparent;
    top: -42px;
    font-size: 30px;
    color: var(--qa-color-font-dark);
    left: 0;
    padding: 6px 6px 6px 0;

    @include media-smaller(xs) {
      top: -36px;
      font-size: 24px;
    }
  }
}
</style>
