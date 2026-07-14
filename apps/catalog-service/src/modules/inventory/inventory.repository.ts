import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { type Model } from 'mongoose';
import { Stock, type StockDocument } from './schemas/stock.schema';

@Injectable()
export class InventoryRepository {
  constructor(
    @InjectModel(Stock.name)
    private readonly stockModel: Model<Stock>,
  ) {}

  create(sku: string, location: string, quantity = 0): Promise<StockDocument> {
    return this.stockModel.create({ sku, location, quantity });
  }

  find(sku: string, location: string): Promise<StockDocument | null> {
    return this.stockModel
      .findOne({
        sku: sku.toUpperCase(),
        location: location.toUpperCase(),
      })
      .exec();
  }

  save(stock: StockDocument): Promise<StockDocument> {
    return stock.save();
  }
}
