import { Injectable } from '@nestjs/common';
import type { ListOrdersResponseDto, OrderDto } from '@retail/contracts';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateOrderDto } from './dto/orders.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateOrderDto): Promise<OrderDto> {
    const existing = await this.prisma.order.findUnique({
      where: { buyOrder: dto.buyOrder },
      include: { items: true },
    });

    if (existing) {
      return this.toDto(existing);
    }

    const order = await this.prisma.order.create({
      data: {
        userId,
        buyOrder: dto.buyOrder,
        amount: dto.amount,
        currency: dto.currency.toUpperCase(),
        status: dto.status,
        authorizationCode: dto.authorizationCode ?? null,
        items: {
          create: dto.items.map((item) => ({
            sku: item.sku.toUpperCase(),
            name: item.name,
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            imageUrl: item.imageUrl ?? '',
          })),
        },
      },
      include: { items: true },
    });

    return this.toDto(order);
  }

  async listForUser(userId: string): Promise<ListOrdersResponseDto> {
    const orders = await this.prisma.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });

    return { items: orders.map((order) => this.toDto(order)) };
  }

  private toDto(order: {
    id: string;
    buyOrder: string;
    amount: number;
    currency: string;
    status: string;
    authorizationCode: string | null;
    createdAt: Date;
    items: Array<{
      id: string;
      sku: string;
      name: string;
      unitPrice: number;
      quantity: number;
      imageUrl: string;
    }>;
  }): OrderDto {
    return {
      id: order.id,
      buyOrder: order.buyOrder,
      amount: order.amount,
      currency: order.currency,
      status: order.status,
      authorizationCode: order.authorizationCode,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        id: item.id,
        sku: item.sku,
        name: item.name,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
        imageUrl: item.imageUrl,
      })),
    };
  }
}
