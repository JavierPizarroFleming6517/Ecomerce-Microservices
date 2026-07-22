import { Module } from '@nestjs/common';
import { CategoriesModule } from '../modules/categories/categories.module';
import { ProductsModule } from '../modules/products/products.module';
import { CatalogMessagingController } from './catalog-messaging.controller';

@Module({
  imports: [ProductsModule, CategoriesModule],
  controllers: [CatalogMessagingController],
})
export class CatalogMessagingModule {}
