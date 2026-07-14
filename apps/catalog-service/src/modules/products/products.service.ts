import { Injectable } from '@nestjs/common';
import {
  type CreateProduct,
  ProductsRepository,
} from './products.repository';

@Injectable()
export class ProductsService {
  constructor(private readonly products: ProductsRepository) {}

  create(input: CreateProduct) {
    return this.products.create(input);
  }

  findBySku(sku: string) {
    return this.products.findBySku(sku);
  }
}
