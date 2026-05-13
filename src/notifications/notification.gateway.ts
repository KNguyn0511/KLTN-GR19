import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
    credentials: false,
  },
})
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server!: Server;

  handleConnection(client: Socket) {
    const auth = client.handshake.auth;
    const query = client.handshake.query;
    
    const role = String(auth?.role ?? query?.role ?? '').toLowerCase();
    const userId = auth?.userId || query?.userId;
    const normalizedRole = role.replace(/\s+/g, '-');

    console.log(`--- [SOCKET CONNECT] ROLE: ${normalizedRole}, USERID: ${userId} ---`);

    if (normalizedRole === 'super-admin' || normalizedRole === 'store-manager') {
      client.join('admin-room');
      console.log('--- [SOCKET] ADMIN JOINED ADMIN-ROOM ---', client.id);
    } else if (normalizedRole === 'customer' && userId) {
      const roomName = userId.toString();
      client.join(roomName);
      console.log(`--- [SOCKET] CUSTOMER ${roomName} JOINED ROOM ---`, client.id);
    } else if (normalizedRole === 'customer') {
      console.warn('--- [SOCKET] CUSTOMER CONNECTED BUT NO USERID PROVIDED ---', client.id);
    }
  }

  handleDisconnect(client: Socket) {
    console.log('--- [SOCKET] CLIENT DISCONNECTED ---', client.id);
  }

  sendNewOrderNotification(payload: any) {
    this.server.to('admin-room').emit('NEW_ORDER_RECEIVED', payload);
  }

  sendNotification(userId: any, payload: { title: string; message: string }) {
    const targetRoom = userId.toString();
    console.log(`--- [SOCKET] SENDING TO ROOM: ${targetRoom} ---`, payload.title);
    this.server.to(targetRoom).emit('NOTIFICATION_RECEIVED', payload);
  }
}
