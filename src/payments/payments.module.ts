import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller'; // Asegurar que esté importado

@Module({
  controllers: [PaymentsController], // Agregar el controlador aquí
  providers: [PaymentsService],
  exports: [PaymentsService],
})
export class PaymentsModule {}
