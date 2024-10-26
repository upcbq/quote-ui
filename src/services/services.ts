import { adaService } from './ada/AdaService';
import { MessageService } from './message/message';

export const Services = {
  initialize() {
    adaService.initialize();
    MessageService.init();
  },
};
