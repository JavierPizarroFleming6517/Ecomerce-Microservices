import { Module } from '@nestjs/common';
import { PaymentsController } from './payments.controller';
import { PaymentsRepository } from './payments.repository';
import { PaymentsService } from './payments.service';
import { TransbankService } from './transbank.service';

@Module({
  controllers: [PaymentsController],
  providers: [PaymentsRepository, TransbankService, PaymentsService],
})
export class PaymentsModule {}
