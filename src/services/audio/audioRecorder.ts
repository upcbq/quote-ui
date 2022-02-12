import { ref } from 'vue';
import { AudioPlayback } from './audioPlayback';
import { Mp3MediaRecorder } from 'mp3-mediarecorder';
import Mp3RecorderWorker from 'worker-loader!./audioRecorder.worker';

export class AudioRecorder {
  private mediaRecorder: Mp3MediaRecorder;
  private currentRecording: Blob[];
  public isRecording = ref<boolean>(false);

  private constructor(stream: MediaStream) {
    this.mediaRecorder = new Mp3MediaRecorder(stream, { worker: Mp3RecorderWorker() });
    this.currentRecording = [];

    this.mediaRecorder.addEventListener('dataavailable', (ev) => {
      this.currentRecording.push(((ev as unknown) as { data: Blob }).data);
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
        const blob = new Blob(this.currentRecording, { type: 'audio/mp3' });
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
