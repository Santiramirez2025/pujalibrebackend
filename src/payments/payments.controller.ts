import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments') // Define la ruta base /payments
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("/")
  async createPayment(@Body() paymentData: any) {
    return this.paymentsService.createPayment(paymentData);
  }
}
