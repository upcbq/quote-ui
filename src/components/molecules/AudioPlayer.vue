<template>
  <div class="qa-audio-player" @keyup="debounceKeyHandler" tabindex="0" ref="playerEl">
    <audio v-if="src" :src="src" ref="audioEl" />
    <IconButton
      :icon="audioPlayback?.playing.value ? 'pause' : 'play_arrow'"
      class="qa-ap-play"
      @click.prevent="
        audioPlayback?.playing.value ? audioPlayback?.pause() : audioPlayback?.play()
      "
      tabindex="-1"
    />
    <div
      class="qa-ap-progress"
      @mousedown.left.prevent="down"
      @mouseup.prevent="up"
      @mousemove.prevent="drag"
      @touchstart.prevent="down"
      @touchend.prevent="up"
      @touchmove.prevent="drag"
    >
      <div class="qa-ap-progress-full">
        <div
          class="qa-ap-progress-inner"
          :style="{ width: `calc(${percentPlayed} * 100%)` }"
        ></div>
      </div>
      <div
        class="qa-ap-progress-handle"
        :style="{
          left: `calc(${dragPercent === -1 ? percentPlayed : dragPercent} * 100%)`,
        }"
        tabindex="0"
      ></div>
    </div>
    <span class="qa-ap-time">
      {{ secondsDisplay }}
    </span>
    <button class="clear-btn qa-ap-rate" @keyup.stop @click.prevent="adjustPlaybackRate">
      <span>{{ rateDisplay }}x</span>
    </button>
  </div>
</template>

<script lang="ts">
import { AudioPlayback } from '@/services/audio/audioPlayback';
import { computed, defineComponent, onMounted, ref, shallowRef } from 'vue';
import IconButton from '@/components/molecules/IconButton.vue';
import debounce from 'lodash/debounce';

export default defineComponent({
  name: 'AudioPlayer',
  props: {
    src: {
      type: String,
      default: '',
    },
  },
  setup() {
    // Element refs
    const playerEl = ref<HTMLElement>();
    const audioEl = ref<HTMLAudioElement>();

    // Audio state
    const audioPlayback = shallowRef<AudioPlayback | undefined>(undefined);
    onMounted(() => {
      if (audioEl.value) {
        audioPlayback.value = new AudioPlayback(audioEl.value);
      }
    });

    /**
     * The percent between 0 and 1 of the audio track's playback
     */
    const percentPlayed = computed(() => {
      return (
        (audioPlayback.value?.seconds.value || 0) /
        (audioPlayback.value?.duration.value || 1)
      );
    });

    /**
     * The seconds played of the audio element
     */
    const secondsDisplay = computed(() => {
      const origSeconds = audioPlayback.value?.seconds.value || 0;
      const minutes = Math.floor(origSeconds / 60);
      const seconds = Math.round(origSeconds % 60);
      return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    });

    /**
     * The string to display in the playback rate button
     */
    const rateDisplay = computed(() => {
      const value =
        Math.round((audioPlayback.value?.playbackRate.value || 1) * 100) / 100;
      return value.toString().replace(/^0\./, '.');
    });

    /**
     * Function to adjust the playback rate; goes 1, 2, 4, 0.5, and loops.
     */
    function adjustPlaybackRate() {
      if (audioPlayback.value) {
        if (audioPlayback.value.playbackRate.value < 4) {
          audioPlayback.value.playbackRate.value *= 2;
        } else {
          audioPlayback.value.playbackRate.value = 0.5;
        }
      }
    }

    // Dragging state
    const dragging = ref(false);
    const wasPlaying = ref(false);
    const dragPercent = ref(-1);

    /**
     * Calculate the percent the mouse or touch event is to the left of the starting box.
     */
    function calculatePercent(e: MouseEvent | TouchEvent) {
      const target = e.currentTarget;
      const x = e instanceof MouseEvent ? e.pageX : e.touches.item(0)?.pageX;
      if (target instanceof HTMLElement && x !== undefined) {
        const targetRect = target.getBoundingClientRect();
        return (x - targetRect.left) / (targetRect.right - targetRect.left);
      }
    }

    /**
     * Handle a drag mouse or touch event for progress bar
     */
    function drag(e: MouseEvent | TouchEvent) {
      if (!dragging.value) return;
      const dragAmount = calculatePercent(e);
      if (typeof dragAmount === 'number') {
        dragPercent.value = dragAmount;
        if (audioPlayback.value) {
          audioPlayback.value.seconds.value =
            audioPlayback.value.duration.value * dragPercent.value;
        }
      }
    }

    /**
     * Handle a touch up or mouse up event for progress bar
     */
    function up(e: MouseEvent | TouchEvent) {
      drag(e);
      dragging.value = false;
      if (wasPlaying.value) {
        wasPlaying.value = false;
        audioPlayback.value?.play();
      }
      dragPercent.value = -1;
      document.removeEventListener('touchend', up);
      document.removeEventListener('mouseup', up);
    }

    /**
     * Handle a touch down or mouse down event for progress bar
     */
    function down(e: MouseEvent | TouchEvent) {
      playerEl.value?.focus();
      if (window.TouchEvent && e instanceof TouchEvent && e.touches.length > 1) return;
      dragging.value = true;
      if (audioPlayback.value?.playing.value) {
        wasPlaying.value = true;
        audioPlayback.value?.pause();
      }
      drag(e);
      document.addEventListener('touchend', up);
      document.addEventListener('mouseup', up);
    }

    /**
     * Calculate the positive or negative time to seek
     */
    function seekTime(forward: boolean, fast: boolean, totalDuration: number) {
      return Math.min(10, totalDuration * (fast ? 0.1 : 0.05)) * (forward ? 1 : -1);
    }

    /**
     * Handle keyboard events for player
     */
    function handleKey(e: KeyboardEvent) {
      const key = e.key;
      switch (key) {
        case ' ':
        case 'Enter':
          audioPlayback.value?.playing.value
            ? audioPlayback.value?.pause()
            : audioPlayback.value?.play();
          break;
        case 'ArrowLeft':
        case 'ArrowRight':
          if (audioPlayback.value) {
            const playing = audioPlayback.value?.playing.value;
            if (playing) {
              audioPlayback.value?.pause();
            }
            const seekAmount = seekTime(
              key === 'ArrowRight',
              e.ctrlKey,
              audioPlayback.value.duration.value || 0
            );
            const newValue = Math.min(
              Math.max(0, audioPlayback.value.seconds.value + seekAmount),
              audioPlayback.value.duration.value
            );
            audioPlayback.value.seconds.value = newValue;

            if (playing) {
              audioPlayback.value?.play();
            }
          }
          break;
        default:
          break;
      }
    }

    const debounceKeyHandler = debounce(handleKey, 100, {
      leading: true,
      trailing: false,
    });

    return {
      playerEl,
      audioEl,
      audioPlayback,
      percentPlayed,
      secondsDisplay,
      rateDisplay,
      adjustPlaybackRate,
      dragging,
      wasPlaying,
      dragPercent,
      down,
      up,
      drag,
      debounceKeyHandler,
    };
  },
  components: { IconButton },
});
</script>

<style lang="scss">
.qa-audio-player {
  background-color: var(--qa-color-white);
  border: 1px solid var(--qa-color-white--darken-20);
  border-radius: 1000px;
  min-width: 100px;
  height: 40px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  padding: 0 16px;

  .qa-ap-play {
    font-size: 26px;
    padding-right: 8px;
    margin-left: -8px;
  }

  .qa-ap-time {
    font-size: 12px;
    font-family: $qa-font-sans;
    color: var(--qa-color-font-dark);
    padding-left: 12px;
  }

  .qa-ap-rate {
    color: var(--qa-color-white);
    background-color: var(--qa-color-font-dark);
    cursor: pointer;
    font-size: 12px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: -6px;
    margin-left: 8px;
  }

  .qa-ap-progress {
    padding: 10px 0;
    flex-grow: 1;
    cursor: pointer;
    position: relative;

    &:hover {
      .qa-ap-progress-handle {
        opacity: 1;
      }
    }
  }

  .qa-ap-progress-handle {
    opacity: 0;
    position: absolute;
    width: 3px;
    height: 12px;
    background-color: var(--qa-color-font-dark);
    top: 50%;
    transform: translate(-50%, -50%);
    transition: opacity 0.1s ease-in-out;

    &:focus {
      opacity: 1;
    }
  }

  .qa-ap-progress-full {
    position: relative;
    overflow: hidden;
    height: 5px;
    border-radius: 1000px;
    background-color: var(--qa-color-white--darken-20);
    width: 100%;
  }

  .qa-ap-progress-inner {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    background-color: var(--qa-color-font-dark);
  }
}
</style>
