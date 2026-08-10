import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiBadGatewayResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import type {
  CrossSellingRecommendationDto,
  HybridRelatedProductsDto,
  ListCategoriesResponseDto,
  ListProductsResponseDto,
  PingResponseDto,
  ProductDetailDto,
  ProductSummaryDto,
} from '@retail/contracts';
import type { Request } from 'express';

import { InternalHttpService } from '../internal/internal-http.service';

type CorrelatedRequest = Request & { correlationId?: string };

@ApiTags('catalog')
@Controller('catalog')
export class CatalogController {
  private readonly catalogServiceUrl: string;
  private readonly recommendationsServiceUrl: string;

  constructor(
    private readonly http: InternalHttpService,
    config: ConfigService,
  ) {
    this.catalogServiceUrl = config.getOrThrow<string>('CATALOG_SERVICE_URL');
    this.recommendationsServiceUrl = config.getOrThrow<string>(
      'RECOMMENDATIONS_SERVICE_URL',
    );
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
    @Query('page') page?: string,
    @Query('category') category?: string,
  ): Promise<ListProductsResponseDto> {
    return this.http.get(this.catalogServiceUrl, '/products', {
      params: {
        limit: limit ? Number(limit) : undefined,
        page: page ? Number(page) : undefined,
        category,
      },
      headers: { 'x-correlation-id': request.correlationId },
    });
  }

  @Get('products/:sku/similar')
  @ApiOkResponse({
    description:
      'Hybrid related products: Neo4j co-purchase + same-category catalog fallback',
  })
  @ApiBadGatewayResponse({ description: 'Downstream service is unavailable' })
  async listSimilarProducts(
    @Req() request: CorrelatedRequest,
    @Param('sku') sku: string,
    @Query('limit') limit?: string,
  ): Promise<HybridRelatedProductsDto> {
    const parsedLimit = limit ? Number(limit) : 8;
    const safeLimit =
      Number.isFinite(parsedLimit) && parsedLimit > 0
        ? Math.min(parsedLimit, 20)
        : 8;
    const headers = { 'x-correlation-id': request.correlationId };

    // =========================================================================
    // Enfoque HÍBRIDO de productos relacionados
    // 1) Co-compra (Neo4j): "quienes compraron esto también compraron..."
    // 2) Categoría (Mongo/catálogo): otros productos de la misma categoría
    // Ambos se devuelven por separado para poder mostrarlos en secciones distintas.
    // =========================================================================

    // -------------------------------------------------------------------------
    // SECCIÓN CO-COMPRA (Neo4j / recommendations-service)
    // Usa el historial Customer -[:PURCHASED]-> Product y ordena por score.
    // -------------------------------------------------------------------------
    let coPurchase: ProductSummaryDto[] = [];
    try {
      const recommendations = await this.http.get<
        CrossSellingRecommendationDto[]
      >(
        this.recommendationsServiceUrl,
        `/recommendations/cross-selling/${encodeURIComponent(sku)}`,
        {
          params: { limit: safeLimit },
          headers,
        },
      );

      const hydrated = await Promise.all(
        recommendations.map(async (recommendation) => {
          try {
            const detail = await this.http.get<ProductDetailDto>(
              this.catalogServiceUrl,
              `/products/${encodeURIComponent(recommendation.productId)}`,
              { headers },
            );

            return this.toSummary(detail);
          } catch {
            return null;
          }
        }),
      );

      coPurchase = hydrated.filter(
        (item): item is ProductSummaryDto => item !== null,
      );
    } catch {
      coPurchase = [];
    }

    // -------------------------------------------------------------------------
    // SECCIÓN POR CATEGORÍA (catalog-service / Mongo)
    // Completa o respalda con productos de la misma categoría.
    // Excluye el SKU actual y los que ya vinieron por co-compra (sin duplicados).
    // -------------------------------------------------------------------------
    let byCategory: ProductSummaryDto[] = [];
    try {
      const categoryCandidates = await this.http.get<ProductSummaryDto[]>(
        this.catalogServiceUrl,
        `/products/${encodeURIComponent(sku)}/similar`,
        {
          // Pedimos un poco más para poder filtrar duplicados y aún llenar el cupo.
          params: { limit: safeLimit * 2 },
          headers,
        },
      );

      const alreadyRecommended = new Set(coPurchase.map((item) => item.sku));
      byCategory = categoryCandidates
        .filter((item) => !alreadyRecommended.has(item.sku))
        .slice(0, safeLimit);
    } catch {
      byCategory = [];
    }

    return { coPurchase, byCategory };
  }

  @Get('products/:sku')
  @ApiOkResponse({ description: 'Product detail' })
  @ApiBadGatewayResponse({ description: 'Catalog service is unavailable' })
  getProduct(
    @Req() request: CorrelatedRequest,
    @Param('sku') sku: string,
  ): Promise<ProductDetailDto> {
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

  private toSummary(detail: ProductDetailDto): ProductSummaryDto {
    return {
      sku: detail.sku,
      name: detail.name,
      description: detail.description,
      price: detail.price,
      currency: detail.currency,
      imageUrl: detail.imageUrl,
      category: detail.category,
      ...(detail.brand ? { brand: detail.brand } : {}),
    };
  }
}
