<template>
  <div class="qa-record">
    Recording test
    <div v-if="!isPlayingBack" class="recording-container">
      <button class="record-btn clear-btn" @click.prevent="record()" v-if="!isRecording">
        <Icon name="fiber_manual_record" color="red"></Icon>
      </button>
      <button class="stop-record-btn clear-btn" @click.prevent="stopRecording()" v-else>
        <Icon name="stop" color="red"></Icon>
      </button>
    </div>
    <div v-else class="playback-container">
      <button class="stop-btn clear-btn" @click.prevent="stop()">
        <Icon name="stop" color="blue"></Icon>
      </button>
      <button class="play-btn clear-btn" @click.prevent="play()" v-if="isPaused">
        <Icon name="play_arrow" color="blue"></Icon>
      </button>
      <button class="pause-btn clear-btn" @click.prevent="pause()" v-else>
        <Icon name="pause" color="blue"></Icon>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { AudioPlayback } from '@/services/audio/audioPlayback';
import { AudioRecorder } from '@/services/audio/audioRecorder';
import Icon from '@/components/content/Icon.vue';
import { computed, defineComponent, ref, shallowRef } from 'vue';

export default defineComponent({
  name: 'QaRecord',
  components: {
    Icon,
  },
  setup() {
    const isPlayingBack = ref<boolean>(false);

    const audioRecorder = shallowRef<AudioRecorder | undefined>(undefined);
    const audioPlayback = shallowRef<AudioPlayback | undefined>(undefined);

    const isPaused = computed(() => {
      return !!audioPlayback.value && !audioPlayback.value.playing.value;
    });

    const isRecording = computed(() => {
      return !!audioRecorder.value && audioRecorder.value.isRecording.value;
    });

    const record = async () => {
      audioRecorder.value = await AudioRecorder.initialize();
      audioRecorder.value.start();
    };

    const stopRecording = async () => {
      const result = await audioRecorder.value!.stop();
      audioPlayback.value = result.audio;
      isPlayingBack.value = true;
      audioRecorder.value = undefined;
    };

    const play = () => {
      audioPlayback.value!.play();
    };

    const pause = () => {
      audioPlayback.value!.pause();
    };

    const stop = () => {
      isPlayingBack.value = false;
      audioPlayback.value!.stop();
    };

    return {
      isRecording,
      isPlayingBack,
      isPaused,
      record,
      stopRecording,
      play,
      pause,
      stop,
    };
  },
});
</script>

<style lang="scss">
.qa-record {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  max-width: 90%;
  height: 200px;

  .material-icons {
    font-size: 50px;
  }
}
</style>
