import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

describe('CategoriesController', () => {
  const categories = {
    listAll: jest.fn(),
  };

  const controller = new CategoriesController(
    categories as unknown as CategoriesService,
  );

  it('returns all categories', async () => {
    categories.listAll.mockResolvedValue([{ name: 'Audio', slug: 'audio' }]);

    await expect(controller.list()).resolves.toEqual({
      items: [{ name: 'Audio', slug: 'audio' }],
    });
  });
});
