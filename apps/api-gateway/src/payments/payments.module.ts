import { Module } from '@nestjs/common';

import { InternalHttpModule } from '../internal/internal-http.module';
import { PaymentsController } from './payments.controller';

@Module({
  imports: [InternalHttpModule],
  controllers: [PaymentsController],
})
export class PaymentsModule {}
