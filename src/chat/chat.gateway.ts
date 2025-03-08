import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer() server!: Server;

  @SubscribeMessage('message')
  handleMessage(_client: any, data: any) {
    this.server.emit(`chat_${data.receiverId}`, data);
  }
}
