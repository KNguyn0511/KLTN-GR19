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

    const isAdmin = [
      'super-admin',
      'store-manager',
      'sales-staff',
      'warehouse-staff',
      'admin',
    ].includes(normalizedRole);

    if (isAdmin) {
      client.join('admin-room');
      console.log(`--- [SOCKET] ADMIN/STAFF (${normalizedRole}) JOINED ADMIN-ROOM ---`, client.id);
    }

    if (userId) {
      const uIdStr = userId.toString();
      client.join(uIdStr);
      client.join(`user-${uIdStr}`);
      console.log(`--- [SOCKET] USER ${uIdStr} JOINED ROOMS ---`, client.id);
    } else if (normalizedRole === 'customer') {
      console.warn('--- [SOCKET] CUSTOMER CONNECTED BUT NO USERID PROVIDED ---', client.id);
    }
  }

  handleDisconnect(client: Socket) {
    console.log('--- [SOCKET] CLIENT DISCONNECTED ---', client.id);
  }

  // --- GENERIC NOTIFICATIONS ---

  /** Gửi thông báo tới toàn bộ Admin (Super Admin, Store Manager, Staff) */
  notifyAdmins(event: string, payload: any) {
    console.log(`[Socket] Sending ${event} to admins`);
    this.server.to('admin-room').emit(event, payload);
  }

  /** Gửi thông báo tới một user cụ thể (convention: user-${userId}) */
  notifyUser(userId: string, event: string, payload: any) {
    console.log(`[Socket] Sending ${event} to user ${userId} (room: user-${userId})`);
    this.server.to(`user-${userId}`).emit(event, payload);
  }

  // --- HELPERS ---

  sendNewOrderNotification(payload: {
    orderCode: string;
    totalPrice: number;
    customerName: string;
  }) {
    this.notifyAdmins('NEW_ORDER_RECEIVED', payload);
  }

  sendNotification(userId: any, payload: { title: string; message: string }) {
    const targetRoom = userId.toString();
    console.log(`--- [SOCKET] SENDING TO ROOM: ${targetRoom} ---`, payload.title);
    this.server.to(targetRoom).emit('NOTIFICATION_RECEIVED', payload);
  }
}
