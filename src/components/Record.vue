<template>
  <div class="qa-record">
    Recording test
    <div v-if="!isPlayingBack" class="recording-container">
      <button
        class="record-btn clear-btn big"
        @click.prevent="record()"
        v-if="!isRecording"
      >
        <Icon name="fiber_manual_record" style="color: red"></Icon>
      </button>
      <button
        class="stop-record-btn clear-btn big"
        @click.prevent="stopRecording()"
        v-else
      >
        <Icon name="stop" style="color: red"></Icon>
      </button>
    </div>
    <div v-else class="playback-container">
      <AudioPlayer :src="audioPlayback?.audioEl.src" />
      <button class="stop-btn clear-btn big" @click.prevent="stop()">
        <Icon name="stop" style="color: blue"></Icon>
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { AudioPlayback } from '@/services/audio/audioPlayback';
import { AudioRecorder } from '@/services/audio/audioRecorder';
import Icon from '@/components/content/Icon.vue';
import { computed, defineComponent, ref, shallowRef } from 'vue';
import AudioPlayer from './molecules/AudioPlayer.vue';

export default defineComponent({
  name: 'QaRecord',
  components: {
    Icon,
    AudioPlayer,
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
      try {
        audioRecorder.value = await AudioRecorder.initialize();
        audioRecorder.value.start();
      } catch (e) {
        console.log(e);
      }
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
      audioPlayback,
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

  .big .material-icons {
    font-size: 50px;
  }
}
</style>
