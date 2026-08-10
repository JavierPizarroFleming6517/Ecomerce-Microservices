import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { ListOrdersResponseDto, OrderDto } from '@retail/contracts';
import {
  JwtAuthGuard,
  type AuthenticatedRequest,
} from '../auth/jwt-auth.guard';
import { CreateOrderDto } from './dto/orders.dto';
import { OrdersService } from './orders.service';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Get()
  list(@Req() request: AuthenticatedRequest): Promise<ListOrdersResponseDto> {
    return this.orders.listForUser(request.user!.userId);
  }

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() body: CreateOrderDto,
  ): Promise<OrderDto> {
    return this.orders.create(request.user!.userId, body);
  }
}
