import { Controller, Logger, UseFilters } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  Payload,
  type RmqContext,
} from '@nestjs/microservices';
import {
  CATALOG_LIST_CATEGORIES,
  CATALOG_LIST_PRODUCTS,
  CATALOG_PING,
  SERVICE_NAMES,
} from '@retail/contracts';
import type {
  ListCategoriesRequestDto,
  ListCategoriesResponseDto,
  ListProductsRequestDto,
  ListProductsResponseDto,
  PingRequestDto,
  PingResponseDto,
} from '@retail/contracts';
import { acknowledgeRmqMessage, RmqRetryFilter } from '@retail/messaging';
import { CategoriesService } from '../modules/categories/categories.service';
import { ProductsService } from '../modules/products/products.service';

@Controller()
@UseFilters(RmqRetryFilter)
export class CatalogMessagingController {
  private readonly logger = new Logger(CatalogMessagingController.name);

  constructor(
    private readonly products: ProductsService,
    private readonly categories: CategoriesService,
  ) {}

  @MessagePattern(CATALOG_PING)
  ping(
    @Payload() payload: PingRequestDto & { correlationId?: string },
    @Ctx() context: RmqContext,
  ): PingResponseDto {
    this.logger.log({
      message: 'Handled catalog.ping',
      correlationId: payload.correlationId,
    });

    acknowledgeRmqMessage(context);

    return {
      service: SERVICE_NAMES.CATALOG,
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  @MessagePattern(CATALOG_LIST_PRODUCTS)
  async listProducts(
    @Payload() payload: ListProductsRequestDto,
    @Ctx() context: RmqContext,
  ): Promise<ListProductsResponseDto> {
    this.logger.log({
      message: 'Handled catalog.products.list',
      correlationId: payload.correlationId,
    });

    if (payload.categorySlug) {
      const category = await this.categories.findBySlug(payload.categorySlug);
      const items = category
        ? await this.products.listActive(payload.limit, category._id)
        : [];

      acknowledgeRmqMessage(context);

      return { items };
    }

    const items = await this.products.listActive(payload.limit);

    acknowledgeRmqMessage(context);

    return { items };
  }

  @MessagePattern(CATALOG_LIST_CATEGORIES)
  async listCategories(
    @Payload() payload: ListCategoriesRequestDto,
    @Ctx() context: RmqContext,
  ): Promise<ListCategoriesResponseDto> {
    this.logger.log({
      message: 'Handled catalog.categories.list',
      correlationId: payload.correlationId,
    });

    const items = await this.categories.listAll();

    acknowledgeRmqMessage(context);

    return { items };
  }
}
