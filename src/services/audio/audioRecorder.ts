import { ref } from 'vue';
import { AudioPlayback } from './audioPlayback';

export class AudioRecorder {
  private mediaRecorder: MediaRecorder;
  private currentRecording: Blob[];
  public isRecording = ref<boolean>(false);

  private constructor(stream: MediaStream) {
    this.mediaRecorder = new MediaRecorder(stream);
    this.currentRecording = [];

    this.mediaRecorder.addEventListener('dataavailable', (ev) => {
      this.currentRecording.push(ev.data);
    });
  }

  /**
   * Create a new AudioRecorder
   */
  public static async initialize(): Promise<AudioRecorder> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    return new AudioRecorder(stream);
  }

  /**
   * Start recording
   */
  public start() {
    this.mediaRecorder.start();
    this.isRecording.value = true;
  }

  /**
   * Stop recording
   */
  public async stop(): Promise<{ blob: Blob; url: string; audio: AudioPlayback }> {
    return new Promise((resolve) => {
      this.mediaRecorder.addEventListener('stop', () => {
        const blob = new Blob(this.currentRecording);
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);

        this.currentRecording = [];

        this.isRecording.value = false;
        resolve({ blob, url, audio: new AudioPlayback(audio) });
      });

      this.mediaRecorder.stop();
    });
  }
}
