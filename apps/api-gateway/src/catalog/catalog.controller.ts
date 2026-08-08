import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBadGatewayResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type {
  ListCategoriesResponseDto,
  ListProductsResponseDto,
  PingResponseDto,
  ProductSummaryDto,
} from '@retail/contracts';
import type { Request } from 'express';

import { InternalHttpService } from '../internal/internal-http.service';

type CorrelatedRequest = Request & { correlationId?: string };

@ApiTags('catalog')
@Controller('catalog')
export class CatalogController {
  private readonly catalogServiceUrl: string;

  constructor(
    private readonly http: InternalHttpService,
    config: ConfigService,
  ) {
    this.catalogServiceUrl = config.getOrThrow<string>('CATALOG_SERVICE_URL');
  }

  @Get('ping')
  @ApiOkResponse({ description: 'Catalog service response' })
  @ApiBadGatewayResponse({ description: 'Catalog service is unavailable' })
  ping(@Req() request: CorrelatedRequest): Promise<PingResponseDto> {
    return this.http.get(this.catalogServiceUrl, '/ping', {
      headers: { 'x-correlation-id': request.correlationId },
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
    return this.http.get(this.catalogServiceUrl, '/products', {
      params: {
        limit: limit ? Number(limit) : undefined,
        category,
      },
      headers: { 'x-correlation-id': request.correlationId },
    });
  }

  @Get('products/:sku')
  @ApiOkResponse({ description: 'Product detail' })
  @ApiBadGatewayResponse({ description: 'Catalog service is unavailable' })
  getProduct(
    @Req() request: CorrelatedRequest,
    @Param('sku') sku: string,
  ): Promise<ProductSummaryDto> {
    return this.http.get(this.catalogServiceUrl, `/products/${sku}`, {
      headers: { 'x-correlation-id': request.correlationId },
    });
  }

  @Get('categories')
  @ApiOkResponse({ description: 'Catalog categories' })
  @ApiBadGatewayResponse({ description: 'Catalog service is unavailable' })
  listCategories(
    @Req() request: CorrelatedRequest,
  ): Promise<ListCategoriesResponseDto> {
    return this.http.get(this.catalogServiceUrl, '/categories', {
      headers: { 'x-correlation-id': request.correlationId },
    });
  }
}
