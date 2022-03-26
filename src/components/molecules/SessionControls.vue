<template>
  <div class="qa-session-controls">
    <template v-if="mode === 'quote'">
      <IconButton
        :icon="shuffle ? 'shuffle_on' : 'shuffle'"
        @click.prevent="shuffle = !shuffle"
        :title="`turn shuffle ${shuffle ? 'off' : 'on'}`"
        :disabled="isRecording"
      >
      </IconButton>
      <Transition name="fade" mode="out-in">
        <RecordButton
          icon="fiber_manual_record"
          class="qa-sc-rec-button"
          border
          v-if="!isRecording"
          @click.prevent="record"
        >
          REC
        </RecordButton>
        <div class="qa-sc-recording" v-else>
          <RecordButton icon="close" class="qa-sc-recording-cancel" @click.prevent="stop">
            {{ $mqs.xs ? '' : 'Cancel' }}
          </RecordButton>
          <RecordButton icon="check" class="qa-sc-recording-next" @click.prevent="next">
            {{ $mqs.xs ? '' : 'Next' }}
          </RecordButton>
        </div>
      </Transition>
      <IconButton
        @click.prevent="skip(currentIndex)"
        icon="skip_next"
        title="skip current verse"
        :disabled="isRecording"
      >
      </IconButton>
    </template>
    <template v-else-if="mode === 'review'"> Review controls </template>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store/store';
import { computed, defineComponent, onMounted, shallowRef } from 'vue';
import IconButton from '@/components/molecules/IconButton.vue';
import RecordButton from '@/components/molecules/RecordButton.vue';
import { AudioRecorder } from '@/services/audio/audioRecorder';
import { AudioDb } from '@/storage/audio.db';

export default defineComponent({
  name: 'SessionControls',
  components: { IconButton, RecordButton },
  emits: {
    recordStart: null,
    recordStop: null,
  },
  props: {
    mode: {
      type: String,
    },
    currentIndex: {
      type: Number,
      default: -1,
    },
  },
  setup(props, ctx) {
    const store = useStore();
    const shuffle = computed({
      get: () => store.state.session.shuffle,
      set: (value) => store.dispatch('session/shuffle', value),
    });

    const autoAdvance = computed(() => store.state.session.options.autoAdvance);

    const sessionId = computed(() => store.state.session.id);

    function skip(index: number) {
      store.dispatch('session/skipVerse', index);
    }

    const audioRecorder = shallowRef<AudioRecorder>();

    async function record() {
      try {
        audioRecorder.value = await AudioRecorder.initialize();
        audioRecorder.value.start();
        ctx.emit('recordStart');
      } catch (e) {
        // Something failed with recording; perhaps an error modal?
      }
    }

    async function stop() {
      try {
        const result = await audioRecorder.value?.stop();
        ctx.emit('recordStop');
        return result;
      } catch (e) {
        // Something failed with stopping recording; uh-oh
      }
    }

    async function next() {
      const result = await stop();
      if (
        result &&
        result.blob &&
        props.currentIndex !== -1 &&
        props.currentIndex !== undefined
      ) {
        try {
          await AudioDb.addAudio({
            sessionId: sessionId.value,
            verseIndex: props.currentIndex,
            audio: {
              type: result.blob.type,
              data: await result.blob.arrayBuffer(),
            },
          });
          store.dispatch('session/quoteVerse', props.currentIndex);

          // If autoAdvance is true, start recording the next card
          if (autoAdvance.value) {
            record();
          }
        } catch (e) {
          // Some error storing audio
        }
      }
    }

    const isRecording = computed(() => !!audioRecorder.value?.isRecording.value);

    onMounted(() => {
      AudioDb.initialize();
    });

    return {
      shuffle,
      skip,
      record,
      stop,
      next,
      audioRecorder,
      isRecording,
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

  .qa-sc-recording-cancel {
    --qa-record-button-color: var(--qa-color-white);
    --qa-record-button-bg-color: var(--qa-color-red);
    --qa-record-button-font-color: var(--qa-color-white);
    .qa-rb-text {
      font-size: 0.7em;
    }
  }
  .qa-sc-recording-next {
    --qa-record-button-color: var(--qa-color-white);
    --qa-record-button-bg-color: var(--qa-color-primary);
    --qa-record-button-font-color: var(--qa-color-white);
    .qa-rb-text {
      font-size: 0.7em;
      margin-left: 0.1em;
    }
  }
  .qa-sc-recording {
    display: flex;
    flex-flow: row nowrap;
    gap: 10px;
  }
  @include media-larger(xs) {
    .qa-sc-recording-next,
    .qa-sc-recording-cancel {
      padding-right: 12px;
    }
  }
  @include media-smaller(xs) {
    .qa-sc-recording-next,
    .qa-sc-recording-cancel {
      font-size: 31.333px;
      padding: 0.1em;
      .qa-rb-text {
        display: none;
      }
    }
  }
}
</style>
