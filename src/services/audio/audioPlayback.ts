import { ref } from 'vue';

export class AudioPlayback {
  private audio: HTMLAudioElement;
  public playing = ref<boolean>(false);

  public constructor(audio: HTMLAudioElement) {
    this.audio = audio;
    this.audio.addEventListener('ended', () => {
      this.playing.value = false;
    });
  }

  /**
   * Start playback
   */
  public play() {
    this.playing.value = true;
    this.audio.play();
  }

  /**
   * Stop playback
   */
  public stop() {
    this.playing.value = false;
    this.audio.pause();
    this.audio.fastSeek(0);
  }

  /**
   * Pause playback
   */
  public pause() {
    this.playing.value = false;
    this.audio.pause();
  }

  /**
   * Getter for audio element
   */
  public get audioEl() {
    return this.audio;
  }
}
