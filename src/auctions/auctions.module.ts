import { Module } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { AuctionsController } from './auctions.controller';
import { AuctionsGateway } from './auctions.gateway'; // ✅ Importamos el Gateway

@Module({
  controllers: [AuctionsController],
  providers: [AuctionsService, AuctionsGateway], // ✅ Agregar el Gateway como proveedor
  exports: [AuctionsService, AuctionsGateway], // ✅ Exportamos el Gateway para que pueda ser usado en otros módulos
})
export class AuctionsModule {}
