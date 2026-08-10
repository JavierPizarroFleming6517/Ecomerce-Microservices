import { Module } from '@nestjs/common';

import { InternalHttpModule } from '../internal/internal-http.module';
import { OrdersController } from './orders.controller';

@Module({
  imports: [InternalHttpModule],
  controllers: [OrdersController],
})
export class OrdersModule {}
