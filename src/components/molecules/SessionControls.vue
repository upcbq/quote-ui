<template>
  <div
    class="qa-session-controls"
    :class="{
      'qa-sc--quote-controls': mode === 'quote',
      'qa-sc--review-controls': mode === 'review',
    }"
  >
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
          <div class="flex row nowrap qa-sc-recording-buttons">
            <RecordButton
              icon="close"
              class="qa-sc-recording-cancel"
              @click.prevent="stop"
            >
              {{ $mqs.xs ? '' : 'Cancel' }}
            </RecordButton>
            <RecordButton icon="check" class="qa-sc-recording-next" @click.prevent="next">
              {{ $mqs.xs ? '' : 'Next' }}
            </RecordButton>
          </div>
          <span class="qa-sc-recording-length">{{ recordingLength }}</span>
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
    <template v-else-if="mode === 'review'">
      <RecordButton icon="close" class="qa-sc-incorrect" @click.prevent="review(false)">
        {{ $mqs.xs ? '' : 'Incorrect' }}
      </RecordButton>
      <AudioPlayer
        :src="audioSrc"
        :disabled="!audioSrc"
        class="qa-sc-player"
        v-model:autoPlay="autoPlay"
        v-model:speed="speed"
      />
      <RecordButton icon="check" class="qa-sc-correct" @click.prevent="review(false)">
        {{ $mqs.xs ? '' : 'Correct' }}
      </RecordButton>
    </template>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store/store';
import { computed, defineComponent, onMounted, ref, shallowRef, watch } from 'vue';
import IconButton from '@/components/molecules/IconButton.vue';
import RecordButton from '@/components/molecules/RecordButton.vue';
import { AudioRecorder } from '@/services/audio/audioRecorder';
import { AudioDb } from '@/storage/audio.db';
import AudioPlayer from './AudioPlayer.vue';
import { secondsToHuman } from '@/utilities/utilityFunctions';

export default defineComponent({
  name: 'SessionControls',
  components: { IconButton, RecordButton, AudioPlayer },
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

    const autoPlay = ref(false);

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

    async function review(correct: boolean) {
      store.dispatch('session/reviewVerse', {
        verseIndex: props.currentIndex,
        correct,
      });

      autoPlay.value = autoAdvance.value;
    }

    const audioSrc = ref('');

    async function updateAudioSrc() {
      audioSrc.value = '';
      if (props.mode === 'review') {
        const sessionId = store.state.session.id;
        if (sessionId) {
          AudioDb.getAudio(sessionId, props.currentIndex).then((audioRecording) => {
            if (audioRecording) {
              const blob = new Blob([audioRecording.audio.data], {
                type: audioRecording.audio.type,
              });
              audioSrc.value = URL.createObjectURL(blob);
            }
          });
        }
      }
    }

    const speed = computed({
      get: () => store.state.session.options.playbackSpeed || 1,
      set: (speed: number) => store.commit('session/setPlaybackSpeed', speed),
    });

    const recordingLength = computed(() => {
      return secondsToHuman((audioRecorder.value?.lengthMs.value || 0) / 1000);
    });

    watch([() => props.currentIndex, () => props.mode], async () => {
      await updateAudioSrc();
    });

    onMounted(() => {
      AudioDb.initialize();
      updateAudioSrc();
    });

    return {
      shuffle,
      skip,
      record,
      stop,
      next,
      audioRecorder,
      isRecording,
      audioSrc,
      review,
      autoPlay,
      speed,
      recordingLength,
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

  &.qa-sc--review-controls {
    gap: 10px;
  }

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
    position: relative;
  }

  .qa-sc-recording-buttons {
    gap: 10px;
  }

  .qa-sc-recording-length {
    font-family: $qa-font-sans;
    color: var(--qa-color-white--darken-50);
    position: absolute;
    top: calc(100% + 5px);
    left: 50%;
    transform: translateX(-50%);
  }

  .qa-sc-player {
    flex-grow: 1;
  }

  .qa-sc-incorrect,
  .qa-sc-correct {
    font-size: 24px;
    .qa-rb-text {
      font-size: 0.7em;
    }
  }

  .qa-sc-incorrect {
    --qa-record-button-color: var(--qa-color-white);
    --qa-record-button-bg-color: var(--qa-color-red);
    --qa-record-button-font-color: var(--qa-color-white);
  }

  .qa-sc-correct {
    --qa-record-button-color: var(--qa-color-white);
    --qa-record-button-bg-color: var(--qa-color-green);
    --qa-record-button-font-color: var(--qa-color-white);
  }

  @include media-larger(xs) {
    .qa-sc-recording-next,
    .qa-sc-recording-cancel,
    .qa-sc-incorrect,
    .qa-sc-correct {
      padding-right: 12px;
    }
    .qa-sc-incorrect,
    .qa-sc-correct {
      height: 32px;
    }
  }
  @include media-smaller(xs) {
    .qa-sc-recording-next,
    .qa-sc-recording-cancel,
    .qa-sc-incorrect,
    .qa-sc-correct {
      font-size: 31.333px;
      padding: 0.1em;
      .qa-rb-text {
        display: none;
      }
    }
  }
}
</style>
