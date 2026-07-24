import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventory: InventoryService) {}

  @Get(':sku')
  async find(
    @Param('sku') sku: string,
    @Query('location') location = 'default',
  ) {
    const stock = await this.inventory.find(sku, location);

    if (!stock) {
      throw new NotFoundException(`Stock not found for ${sku}/${location}`);
    }

    return stock;
  }
}
