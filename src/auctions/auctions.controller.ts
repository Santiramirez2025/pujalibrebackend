import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { CreateAuctionDto } from './dto/create-auction.dto';
import { Auction } from './entities/auction.entity'; // ✅ Importación correcta

@Controller('auctions')  // ✅ Solo 'auctions', ya que el prefijo global es 'api'
export class AuctionsController {
  constructor(private readonly auctionsService: AuctionsService) {}

  @Post('create')
  async createAuction(@Body() createAuctionDto: CreateAuctionDto): Promise<Auction> {
    return this.auctionsService.create(createAuctionDto);
  }

  @Get(':id')
  async getAuctionById(@Param('id') id: string): Promise<Auction | undefined> {
    return this.auctionsService.findById(Number(id));  // ✅ Conversión segura
  }

  @Get('active')
  async getActiveAuctions(): Promise<Auction[]> {
    return this.auctionsService.findActive();
  }

  @Post('/bid')
  placeBid(@Body() bidData: { auctionId: string | number; bidAmount: string | number; bidder: string }) {
    return this.auctionsService.placeBid(Number(bidData.auctionId), Number(bidData.bidAmount), bidData.bidder);
  }
}
