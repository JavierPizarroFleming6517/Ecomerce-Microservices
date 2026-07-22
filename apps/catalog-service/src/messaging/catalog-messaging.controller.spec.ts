import { type RmqContext } from '@nestjs/microservices';
import { CatalogMessagingController } from './catalog-messaging.controller';
import type { CategoriesService } from '../modules/categories/categories.service';
import type { ProductsService } from '../modules/products/products.service';

function createContext(): { ack: jest.Mock; context: RmqContext } {
  const ack = jest.fn();
  const message = {};
  const context = {
    getChannelRef: () => ({ ack }),
    getMessage: () => message,
  } as unknown as RmqContext;

  return { ack, context };
}

describe('CatalogMessagingController', () => {
  it('acknowledges CATALOG_PING messages manually', () => {
    const { ack, context } = createContext();
    const products = {} as ProductsService;
    const categories = {} as CategoriesService;

    const response = new CatalogMessagingController(
      products,
      categories,
    ).ping({ correlationId: 'test-correlation-id' }, context);

    expect(ack).toHaveBeenCalledWith({});
    expect(response).toMatchObject({
      service: 'catalog',
      status: 'ok',
    });
    expect(typeof response.timestamp).toBe('string');
  });

  it('acknowledges CATALOG_LIST_PRODUCTS messages and returns mapped items', async () => {
    const { ack, context } = createContext();
    const listActive = jest.fn().mockResolvedValue([
      {
        sku: 'SKU-1',
        name: 'Product 1',
        description: '',
        price: 10,
        currency: 'USD',
        imageUrl: 'https://example.com/image.png',
        category: 'demo',
      },
    ]);
    const products = { listActive } as unknown as ProductsService;
    const categories = {} as CategoriesService;

    const response = await new CatalogMessagingController(
      products,
      categories,
    ).listProducts({ limit: 5, correlationId: 'test-correlation-id' }, context);

    expect(listActive).toHaveBeenCalledWith(5);
    expect(ack).toHaveBeenCalledWith({});
    expect(response.items).toHaveLength(1);
  });

  it('resolves categorySlug before listing products and returns empty items for unknown slugs', async () => {
    const { ack, context } = createContext();
    const listActive = jest.fn().mockResolvedValue([]);
    const products = { listActive } as unknown as ProductsService;
    const findBySlug = jest.fn().mockResolvedValue(null);
    const categories = { findBySlug } as unknown as CategoriesService;

    const response = await new CatalogMessagingController(
      products,
      categories,
    ).listProducts(
      { categorySlug: 'unknown', correlationId: 'test-correlation-id' },
      context,
    );

    expect(findBySlug).toHaveBeenCalledWith('unknown');
    expect(listActive).not.toHaveBeenCalled();
    expect(ack).toHaveBeenCalledWith({});
    expect(response.items).toEqual([]);
  });

  it('acknowledges CATALOG_LIST_CATEGORIES messages and returns mapped items', async () => {
    const { ack, context } = createContext();
    const listAll = jest
      .fn()
      .mockResolvedValue([{ name: 'Audio', slug: 'audio' }]);
    const categories = { listAll } as unknown as CategoriesService;
    const products = {} as ProductsService;

    const response = await new CatalogMessagingController(
      products,
      categories,
    ).listCategories({ correlationId: 'test-correlation-id' }, context);

    expect(listAll).toHaveBeenCalled();
    expect(ack).toHaveBeenCalledWith({});
    expect(response.items).toEqual([{ name: 'Audio', slug: 'audio' }]);
  });
});
