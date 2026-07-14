import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InventoryRepository } from './inventory.repository';

@Injectable()
export class InventoryService {
  constructor(private readonly inventory: InventoryRepository) {}

  create(sku: string, location: string, quantity = 0) {
    if (quantity < 0) {
      throw new BadRequestException('Stock quantity cannot be negative');
    }

    return this.inventory.create(sku, location, quantity);
  }

  async adjust(sku: string, location: string, delta: number) {
    const stock = await this.inventory.find(sku, location);
    if (!stock) {
      throw new NotFoundException(`Stock not found for ${sku}/${location}`);
    }

    const nextQuantity = stock.quantity + delta;
    if (nextQuantity < 0) {
      throw new BadRequestException('Insufficient stock');
    }

    stock.quantity = nextQuantity;
    return this.inventory.save(stock);
  }

  find(sku: string, location: string) {
    return this.inventory.find(sku, location);
  }
}
