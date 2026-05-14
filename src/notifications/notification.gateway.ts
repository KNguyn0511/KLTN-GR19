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
    console.log('--- NEW ADMIN CONNECTED ---', client.id);
    console.log('Client connected:', client.id);
    console.log('Handshake Query:', client.handshake.query);

    const role = String(
      client.handshake.auth?.role ?? client.handshake.query?.role ?? '',
    ).toLowerCase();
    const normalizedRole = role.replace(/\s+/g, '-');

    const userId = client.handshake.query?.userId as string;
    if (userId) {
      client.join(`user-${userId}`);
      console.log(`User ${userId} joined their notification room.`);
    }

    if (normalizedRole === 'super-admin' || normalizedRole === 'store-manager') {
      client.join('admin-room');
      console.log('CLIENT JOINED ADMIN-ROOM:', client.id, 'role:', normalizedRole);
    }
  }

  handleDisconnect(client: Socket) {
    client.leave('admin-room');
    if (client.handshake.query?.userId) {
      client.leave(`user-${client.handshake.query.userId}`);
    }
  }

  // --- GENERIC NOTIFICATIONS ---

  /** Gửi thông báo tới toàn bộ Admin (Super Admin, Store Manager) */
  notifyAdmins(event: string, payload: any) {
    console.log(`[Socket] Sending ${event} to admins`);
    this.server.to('admin-room').emit(event, payload);
  }

  /** Gửi thông báo tới một user cụ thể (nếu họ đang online và join room tương ứng) */
  notifyUser(userId: string, event: string, payload: any) {
    console.log(`[Socket] Sending ${event} to user ${userId}`);
    this.server.to(`user-${userId}`).emit(event, payload);
  }

  // --- LEGACY HELPERS ---

  sendNewOrderNotification(payload: {
    orderCode: string;
    totalPrice: number;
    customerName: string;
  }) {
    this.notifyAdmins('NEW_ORDER_RECEIVED', payload);
  }
}
