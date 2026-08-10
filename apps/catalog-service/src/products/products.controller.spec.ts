import { CategoriesService } from '../categories/categories.service';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  const products = {
    listActive: jest.fn(),
  };
  const categories = {
    findBySlug: jest.fn(),
  };

  const controller = new ProductsController(
    products as unknown as ProductsService,
    categories as unknown as CategoriesService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('lists active products without category filter', async () => {
    products.listActive.mockResolvedValue({
      items: [{ sku: 'SKU-1' }],
      page: 1,
      pageSize: 5,
      total: 1,
      totalPages: 1,
    });

    await expect(controller.list('5', '1')).resolves.toEqual({
      items: [{ sku: 'SKU-1' }],
      page: 1,
      pageSize: 5,
      total: 1,
      totalPages: 1,
    });
    expect(products.listActive).toHaveBeenCalledWith(5, undefined, 1);
  });

  it('filters products by category slug', async () => {
    categories.findBySlug.mockResolvedValue({ _id: 'cat-1' });
    products.listActive.mockResolvedValue({
      items: [{ sku: 'SKU-2' }],
      page: 2,
      pageSize: 12,
      total: 20,
      totalPages: 2,
    });

    await expect(
      controller.list(undefined, '2', 'computacion'),
    ).resolves.toEqual({
      items: [{ sku: 'SKU-2' }],
      page: 2,
      pageSize: 12,
      total: 20,
      totalPages: 2,
    });
    expect(products.listActive).toHaveBeenCalledWith(undefined, 'cat-1', 2);
  });

  it('returns empty items when category slug is unknown', async () => {
    categories.findBySlug.mockResolvedValue(null);

    await expect(controller.list(undefined, '1', 'missing')).resolves.toEqual({
      items: [],
      page: 1,
      pageSize: 12,
      total: 0,
      totalPages: 0,
    });
    expect(products.listActive).not.toHaveBeenCalled();
  });
});
