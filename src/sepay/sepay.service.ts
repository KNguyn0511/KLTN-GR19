import { Injectable, Logger } from '@nestjs/common';
import { SalesService } from '../sales/sales.service';
import { TransactionsService } from '../transactions/transactions.service';
import { PaymentMethod, TransactionType, TransactionStatus } from '../transactions/schemas/transaction.schema';

@Injectable()
export class SepayService {
  private readonly logger = new Logger(SepayService.name);

  constructor(
    private readonly salesService: SalesService,
    private readonly transactionsService: TransactionsService,
  ) {}

  async processWebhook(payload: any) {
    this.logger.log(`Received Sepay webhook: ${JSON.stringify(payload)}`);

    // Sepay webhook payload typically contains transferType, transferAmount, content, id.
    // We accommodate common variations just in case.
    const transferType = payload.transferType || payload.transfer_type || 'in';
    const amount = Number(payload.transferAmount || payload.amount || payload.amount_in || 0);
    const content = String(payload.content || payload.description || payload.code || '');
    const transactionId = String(payload.id || payload.referenceCode || '');

    // Only process incoming transfers
    if (transferType !== 'in' || amount <= 0) {
      this.logger.warn('Ignoring webhook: not an incoming transfer or amount is 0');
      return;
    }

    // Extract Order Code from content, e.g., NT-2026-1234 or NT20261234 (banks often remove hyphens)
    const match = content.match(/NT[- ]?\d{4}[- ]?\d{4}/i);
    if (!match) {
      this.logger.warn(`No valid order code found in content: ${content}`);
      return;
    }

    // Reformat to NT-YYYY-XXXX just in case hyphens were removed
    const rawMatch = match[0].toUpperCase().replace(/[- ]/g, ''); // NT20261234
    const orderCode = `NT-${rawMatch.slice(2, 6)}-${rawMatch.slice(6)}`;
    this.logger.log(`Found order code: ${orderCode}`);

    // Find the order
    const order = await this.salesService.findOrderByCode(orderCode);
    if (!order) {
      this.logger.warn(`Order not found for code: ${orderCode}`);
      return;
    }

    if (order.status === 'COMPLETED' || order.status === 'CANCELLED' || order.status === 'PAID') {
      this.logger.log(`Order ${orderCode} is already ${order.status}. Skipping status update.`);
      // Still log the transaction to keep history, but we don't update order status.
    } else if (amount >= order.totalAmount) {
      // Amount is sufficient, update order status to PAID
      this.logger.log(`Updating order ${orderCode} status to PAID`);
      await this.salesService.updateOrderStatus(String(order._id), 'PAID');
    } else {
      this.logger.warn(`Amount ${amount} is less than order total ${order.totalAmount}. Order status not updated.`);
    }

    // Create a transaction record
    try {
      await this.transactionsService.createTransaction({
        orderId: String(order._id),
        userId: String(order.user),
        type: TransactionType.Payment,
        paymentMethod: PaymentMethod.BankTransfer,
        amount: amount,
        note: `Thanh toán chuyển khoản qua Sepay. Nội dung: ${content}`,
        status: TransactionStatus.Success,
        providerTransactionId: transactionId,
        gatewayResponse: payload,
      });
      this.logger.log(`Transaction created for order ${orderCode}`);
    } catch (err) {
      this.logger.error(`Error creating transaction for order ${orderCode}:`, err);
    }
  }
}
