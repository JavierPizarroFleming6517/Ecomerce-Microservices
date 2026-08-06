import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import {
  CommitTransactionDto,
  CreateTransactionDto,
} from './dto/payments.dto';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('transactions')
  create(@Body() body: CreateTransactionDto) {
    return this.payments.createTransaction(body);
  }

  @Post('transactions/commit')
  commit(@Body() body: CommitTransactionDto) {
    return this.payments.commitTransaction(body.token);
  }

  @Get('transactions/:token')
  findOne(@Param('token') token: string) {
    return this.payments.getTransaction(token);
  }
}
