import { Controller, Get, Query } from '@nestjs/common';
import { TrendingService } from './trending.service';

@Controller('trending')
export class TrendingController {
    constructor(private readonly trendingService: TrendingService) { }

    @Get()
    getTrending(@Query('limit') limit: number) {
        return this.trendingService.getTrending(limit || 10);
    }

    @Get('trigger')
    triggerCalculation() {
        return this.trendingService.calculateTrending();
    }
}
