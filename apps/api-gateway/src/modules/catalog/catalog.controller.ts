import { Controller, Get, Inject, Query, Req } from '@nestjs/common';
import type { ClientProxy } from '@nestjs/microservices';
import { ApiBadGatewayResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  CATALOG_LIST_CATEGORIES,
  CATALOG_LIST_PRODUCTS,
  CATALOG_PING,
} from '@retail/contracts';
import type {
  ListCategoriesResponseDto,
  ListProductsResponseDto,
} from '@retail/contracts';
import type { Request } from 'express';

import { CATALOG_CLIENT } from '../../messaging/messaging.constants';
import { RpcClientService } from '../../messaging/rpc-client.service';

type CorrelatedRequest = Request & { correlationId?: string };

@ApiTags('catalog')
@Controller('catalog')
export class CatalogController {
  constructor(
    @Inject(CATALOG_CLIENT) private readonly catalogClient: ClientProxy,
    private readonly rpcClient: RpcClientService,
  ) {}

  @Get('ping')
  @ApiOkResponse({ description: 'Catalog service response' })
  @ApiBadGatewayResponse({ description: 'Catalog service is unavailable' })
  ping(@Req() request: CorrelatedRequest): Promise<unknown> {
    return this.rpcClient.send(this.catalogClient, CATALOG_PING, {
      correlationId: request.correlationId,
    });
  }

  @Get('products')
  @ApiOkResponse({ description: 'Featured products' })
  @ApiBadGatewayResponse({ description: 'Catalog service is unavailable' })
  listProducts(
    @Req() request: CorrelatedRequest,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
  ): Promise<ListProductsResponseDto> {
    return this.rpcClient.send(this.catalogClient, CATALOG_LIST_PRODUCTS, {
      limit: limit ? Number(limit) : undefined,
      categorySlug: category,
      correlationId: request.correlationId,
    });
  }

  @Get('categories')
  @ApiOkResponse({ description: 'Catalog categories' })
  @ApiBadGatewayResponse({ description: 'Catalog service is unavailable' })
  listCategories(
    @Req() request: CorrelatedRequest,
  ): Promise<ListCategoriesResponseDto> {
    return this.rpcClient.send(this.catalogClient, CATALOG_LIST_CATEGORIES, {
      correlationId: request.correlationId,
    });
  }
}
