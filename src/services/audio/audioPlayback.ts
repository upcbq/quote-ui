import { computed, ref } from 'vue';

export class AudioPlayback {
  private audio: HTMLAudioElement;
  public playing = ref<boolean>(false);

  public duration = ref<number>(0);

  // Allows setting the current time on the player
  private secondsRef = ref<number>(0);
  public seconds = computed({
    get: () => this.secondsRef.value,
    set: (value) => this.seek(value),
  });

  public maxListened = ref<number>(0);

  // Allows setting the playback rate of the player
  private playbackRateRef = ref<number>(1);
  public playbackRate = computed({
    get: () => this.playbackRateRef.value,
    set: (value) => (this.audio.playbackRate = value),
  });

  public constructor(audio: HTMLAudioElement) {
    this.audio = audio;
    this.duration.value = this.audio.duration;
    this.secondsRef.value = this.audio.currentTime;
    this.playbackRateRef.value = this.audio.playbackRate;
    this.maxListened.value = 0;

    // Add listeners to update our various refs
    this.audio.addEventListener('play', () => {
      this.playing.value = true;
    });
    this.audio.addEventListener('ended', () => {
      this.playing.value = false;
      this.secondsRef.value = 0;
      this.maxListened.value = 1;
    });
    this.audio.addEventListener('pause', () => {
      this.playing.value = false;
    });
    this.audio.addEventListener('timeupdate', () => {
      this.secondsRef.value = this.audio.currentTime;

      // TODO: this won't work. Need to check if greater than last and also reset on new audio load
      this.maxListened.value =
        Math.round((this.secondsRef.value / this.duration.value) * 100) / 100;
    });
    this.audio.addEventListener('ratechange', () => {
      this.playbackRateRef.value = this.audio.playbackRate;
    });
    this.audio.addEventListener('durationchange', () => {
      this.duration.value = this.audio.duration;
    });
  }

  /**
   * Start playback
   */
  public play() {
    this.audio.play();
  }

  /**
   * Stop playback
   */
  public stop() {
    this.audio.pause();
    this.seek(0);
  }

  /**
   * Pause playback
   */
  public pause() {
    this.audio.pause();
  }

  /**
   * Seek
   */
  public seek(time: number) {
    if (this.audio.fastSeek) {
      this.audio.fastSeek(time);
    } else {
      this.audio.currentTime = time;
    }
  }

  /**
   * Getter for audio element
   */
  public get audioEl() {
    return this.audio;
  }
}
