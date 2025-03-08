import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class AuctionsGateway {
    @WebSocketServer()
    server: Server;

    constructor() {
        this.server = new Server(); // Asegurar inicialización
    }

    @SubscribeMessage('puja')
    handlePuja(@MessageBody() data: { subastaId: string; usuario: string; oferta: number }) {
        console.log(`Nueva puja en la subasta ${data.subastaId}: $${data.oferta} por ${data.usuario}`);

        this.server.to(data.subastaId).emit('nuevaPuja', data);

        return { success: true, message: 'Puja recibida correctamente' };
    }

    @SubscribeMessage('unirseSubasta')
    handleUnirseSubasta(@MessageBody() data: { subastaId: string }) {
        console.log(`Usuario se unió a la subasta ${data.subastaId}`);
        this.server.socketsJoin(data.subastaId);
    }
}
