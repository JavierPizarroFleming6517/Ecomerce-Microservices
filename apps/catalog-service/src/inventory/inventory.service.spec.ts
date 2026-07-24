import { BadRequestException } from '@nestjs/common';
import { type InventoryRepository } from './inventory.repository';
import { InventoryService } from './inventory.service';
import { type StockDocument } from './schemas/stock.schema';

describe('InventoryService', () => {
  it('prevents stock from becoming negative', async () => {
    const stock = { quantity: 2 } as StockDocument;
    const repository = {
      find: jest.fn().mockResolvedValue(stock),
      save: jest.fn(),
    } as unknown as InventoryRepository;
    const service = new InventoryService(repository);

    await expect(service.adjust('SKU-1', 'MAIN', -3)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(repository.save).not.toHaveBeenCalled();
  });
});
