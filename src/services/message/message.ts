export const QUOTE_UI_CHANNEL = 'upcbq.quote.ui';
export interface Message<T> {
  type: string;
  value: T;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type MessageHandler = (...args: any[]) => any;
export class MessageService {
  public static broadcastChannel: BroadcastChannel | undefined;
  public static eventListeners: Record<string, Record<string, Array<MessageHandler>>> =
    {};

  public static init() {
    this.broadcastChannel = new BroadcastChannel(QUOTE_UI_CHANNEL);
    this.eventListeners[QUOTE_UI_CHANNEL] = {};
    this.broadcastChannel.addEventListener('message', this.handleMessage.bind(this));
  }

  public static sendMessage<T>(message: Message<T>) {
    if (!this.broadcastChannel) {
      this.init();
    }
    this.broadcastChannel?.postMessage(message);
  }

  public static handleMessage(message: MessageEvent<Message<unknown>>) {
    if (!message.data.type) return;
    for (const handler of this.eventListeners?.[QUOTE_UI_CHANNEL]?.[message.data.type] ||
      []) {
      handler(message.data.value);
    }
  }

  public static addMessageListener(messageType: string, listener: MessageHandler) {
    if (!this.broadcastChannel) {
      this.init();
    }
    if (!this.eventListeners[QUOTE_UI_CHANNEL][messageType]) {
      this.eventListeners[QUOTE_UI_CHANNEL][messageType] = [];
    }
    this.eventListeners[QUOTE_UI_CHANNEL][messageType].push(listener);
  }
}
