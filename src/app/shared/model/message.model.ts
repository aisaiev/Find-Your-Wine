import { Message_Type } from 'src/app/app.constants';

export interface IMessage {
  type: Message_Type;
  data: any;
}
