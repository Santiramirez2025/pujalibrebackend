import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Auction } from './entities/auction.entity'; // ✅ Importación correcta
import { CreateAuctionDto } from './dto/create-auction.dto';
import { AuctionsGateway } from './auctions.gateway';

@Injectable()
export class AuctionsService {
  constructor(private readonly auctionsGateway: AuctionsGateway) {}

  private auctions: Auction[] = [];

  // ✅ Crear una subasta
  create(createAuctionDto: CreateAuctionDto): Auction {
    const newAuction: Auction = {
      id: Date.now(),
      ...createAuctionDto,
      active: true,
      highestBid: createAuctionDto.startingPrice,
      highestBidder: '',
    };

    this.auctions.push(newAuction);
    console.log(`✅ Subasta creada: ${newAuction.title} con ID ${newAuction.id}`);

    return newAuction;
  }

  // ✅ Obtener subasta por ID con conversión segura
  findById(id: number | string): Auction | undefined {
    const auctionId = Number(id);
    return this.auctions.find((auction) => auction.id === auctionId);
  }

  // ✅ Obtener todas las subastas activas
  findActive(): Auction[] {
    return this.auctions.filter((auction) => auction.active);
  }

  // ✅ Hacer una puja con validaciones mejoradas
  placeBid(auctionId: number | string, bidAmount: number | string, bidder: string) {
    console.log(`📢 Nueva puja recibida: ${bidAmount} para la subasta ${auctionId} por ${bidder}`);

    const auction = this.findById(auctionId);
    const bid = Number(bidAmount); // Convertimos a número

    if (!auction) {
        console.warn(`⚠️ Subasta con ID ${auctionId} no encontrada.`);
        throw new NotFoundException('Subasta no encontrada.');
    }

    if (!auction.active) {
        console.warn(`⚠️ Intento de puja en subasta cerrada: ID ${auctionId}`);
        throw new BadRequestException('Esta subasta ya ha finalizado.');
    }

    if (isNaN(bid) || bid <= (auction.highestBid || auction.startingPrice)) {
        console.warn(`⚠️ Puja rechazada: Oferta menor o inválida.`);
        throw new BadRequestException('La puja debe ser mayor a la oferta actual.');
    }

    auction.highestBid = bid;
    auction.highestBidder = bidder;

    console.log(`✅ Puja exitosa: ${bid} por ${bidder}`);

    // 🔥 Emitir evento a WebSockets para actualizar en tiempo real
    this.auctionsGateway.server.to(auctionId.toString()).emit('nuevaPuja', {
        auctionId,
        highestBid: bid,
        highestBidder: bidder,
    });

    return {
        message: 'Puja realizada con éxito',
        newHighestBid: bid,
        highestBidder: bidder,
    };
  }
}
