import { ref } from 'vue';
import { AudioPlayback } from './audioPlayback';
import { Mp3MediaRecorder } from 'mp3-mediarecorder';
import Mp3RecorderWorker from 'worker-loader!./audioRecorder.worker';

export class AudioRecorder {
  private static worker: ReturnType<typeof Mp3RecorderWorker>;
  private stream?: MediaStream;
  private mediaRecorder?: Mp3MediaRecorder;
  private currentRecording: Blob[];
  public isRecording = ref<boolean>(false);
  public lengthMs = ref<number>(0);
  public dateStarted = ref<number>(0);
  public interval = -1;

  public constructor() {
    this.currentRecording = [];
    if (!AudioRecorder.worker) {
      AudioRecorder.worker = Mp3RecorderWorker();
    }
  }

  /**
   * Start recording
   */
  public async start() {
    this.removeMediaRecorder();
    await this.setupMediaRecorder();
    this.mediaRecorder!.start();
    this.isRecording.value = true;
    this.dateStarted.value = new Date().getTime();
    this.interval = setInterval(() => {
      this.lengthMs.value = new Date().getTime() - this.dateStarted.value;
    }, 1000);
  }

  /**
   * Stop recording
   */
  public async stop(): Promise<{
    blob: Blob;
    url: string;
    audio: AudioPlayback;
    length: number;
  }> {
    return new Promise((resolve, rej) => {
      if (!this.mediaRecorder) {
        rej();
        return;
      }
      const stopListener = () => {
        const blob = new Blob(this.currentRecording, { type: 'audio/mp3' });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        const length = this.lengthMs.value;

        this.currentRecording = [];

        this.isRecording.value = false;
        this.dateStarted.value = 0;
        this.lengthMs.value = 0;
        clearInterval(this.interval);
        this.interval = -1;
        resolve({ blob, url, audio: new AudioPlayback(audio), length });
        this.mediaRecorder?.removeEventListener('stop', stopListener);
        this.removeMediaRecorder();
      };
      this.mediaRecorder.addEventListener('stop', stopListener);

      this.mediaRecorder.stop();
    });
  }

  private async setupMediaRecorder() {
    if (!this.stream) {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    }
    this.mediaRecorder = new Mp3MediaRecorder(this.stream, {
      worker: AudioRecorder.worker,
    });
    this.currentRecording = [];

    this.mediaRecorder.addEventListener('dataavailable', this.boundOnDataAvailable);
  }

  private boundOnDataAvailable = this.onDataAvailable.bind(this);

  private onDataAvailable(ev: unknown) {
    this.currentRecording.push((ev as { data: Blob }).data);
  }

  private removeMediaRecorder() {
    this.mediaRecorder?.removeEventListener('dataavailable', this.boundOnDataAvailable);
    delete this.mediaRecorder;
    this.stream?.getTracks().forEach((t) => t.stop());
    delete this.stream;
  }
}
