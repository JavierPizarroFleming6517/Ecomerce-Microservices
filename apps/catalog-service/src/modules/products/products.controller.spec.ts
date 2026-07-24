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
    products.listActive.mockResolvedValue([{ sku: 'SKU-1' }]);

    await expect(controller.list('5')).resolves.toEqual({
      items: [{ sku: 'SKU-1' }],
    });
    expect(products.listActive).toHaveBeenCalledWith(5);
  });

  it('filters products by category slug', async () => {
    categories.findBySlug.mockResolvedValue({ _id: 'cat-1' });
    products.listActive.mockResolvedValue([{ sku: 'SKU-2' }]);

    await expect(controller.list(undefined, 'computacion')).resolves.toEqual({
      items: [{ sku: 'SKU-2' }],
    });
    expect(products.listActive).toHaveBeenCalledWith(undefined, 'cat-1');
  });

  it('returns empty items when category slug is unknown', async () => {
    categories.findBySlug.mockResolvedValue(null);

    await expect(controller.list(undefined, 'missing')).resolves.toEqual({
      items: [],
    });
    expect(products.listActive).not.toHaveBeenCalled();
  });
});
