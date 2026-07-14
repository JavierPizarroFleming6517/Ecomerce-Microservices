import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createNestPinoOptions, LoggerModule } from '@retail/logger';
import { validateEnvironment } from './config/env.validation';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { CatalogMessagingModule } from './messaging/catalog-messaging.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { InventoryModule } from './modules/inventory/inventory.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validate: validateEnvironment,
    }),
    LoggerModule.forRoot(
      createNestPinoOptions({ serviceName: 'catalog-service' }),
    ),
    DatabaseModule,
    CategoriesModule,
    ProductsModule,
    InventoryModule,
    HealthModule,
    CatalogMessagingModule,
  ],
})
export class AppModule {}
