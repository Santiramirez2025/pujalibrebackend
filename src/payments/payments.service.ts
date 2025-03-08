import { Injectable } from '@nestjs/common';
const mercadopago = require('mercadopago');

mercadopago.configure({
  access_token: process.env.MERCADOPAGO_ACCESS_TOKEN || 'APP_USR-1363952196827446-011409-fc7ee441e92371e6b7c33002c5e29332-2209976933',
});

@Injectable()
export class PaymentsService {
  async createPayment(paymentData: any) {
    try {
      const response = await mercadopago.preferences.create({
        body: {
          items: [
            {
              title: paymentData.title,
              quantity: 1,
              unit_price: paymentData.amount,
            },
          ],
          payer: {
            email: paymentData.payer_email,
          },
          payment_methods: {
            excluded_payment_types: [{ id: "ticket" }], // Evita pagos con boletas/tickets
          },
        },
      });

      return response.body;
    } catch (error: any) {
      console.error("❌ Error en Mercado Pago:", error);
      throw new Error("Error al procesar el pago: " + (error.message || error));
    }    
  }
}
