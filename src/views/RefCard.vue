<template>
  <div class="qa-ref-card">
    <QuizCard v-if="activeVerseString" :ref-text="activeVerseString" class="qa-rc-card" />
  </div>
</template>

<script lang="ts">
import { IReference } from '@/api/types';
import QuizCard from '@/components/atoms/QuizCard.vue';
import { MessageService } from '@/services/message/message';
import { useStore } from '@/store/store';
import { referenceToString } from '@/utilities/utilityFunctions';
import { computed, defineComponent, onMounted, ref } from 'vue';

export default defineComponent({
  name: 'RefCard',
  components: {
    QuizCard,
  },
  setup() {
    const store = useStore();
    const receivedRef = ref<(IReference & { index: number }) | undefined>(undefined);
    onMounted(() => {
      MessageService.addMessageListener(
        'activeVerseUpdate',
        (ref: (IReference & { index: number }) | undefined) => {
          receivedRef.value = ref;
        }
      );
    });
    const activeVerseRef = computed(() => {
      return receivedRef.value || store.getters['session/unquotedVerses'].at(0);
    });
    const activeVerseString = computed(() => {
      return (activeVerseRef.value && referenceToString(activeVerseRef.value)) || '';
    });
    return { activeVerseString };
  },
});
</script>

<style lang="scss">
.qa-ref-card {
  width: 100%;
  min-height: 100%;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;

  .qa-rc-card {
    width: 100%;
  }
}
</style>
