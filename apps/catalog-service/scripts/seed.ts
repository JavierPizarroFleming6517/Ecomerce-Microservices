import mongoose from 'mongoose';
import { CategorySchema, Category } from '../src/modules/categories/schemas/category.schema';
import { ProductSchema, Product } from '../src/modules/products/schemas/product.schema';
import { StockSchema, Stock } from '../src/modules/inventory/schemas/stock.schema';

interface SeedCategory {
  name: string;
  slug: string;
}

interface SeedProduct {
  sku: string;
  name: string;
  description: string;
  categorySlug: string;
  price: number;
  currency: string;
  /** Fixed Unsplash CDN URL so the same photo is always shown. */
  imageUrl: string;
  quantity: number;
}

const WAREHOUSE_LOCATION = 'MAIN';

const categories: SeedCategory[] = [
  { name: 'Periféricos', slug: 'perifericos' },
  { name: 'Audio', slug: 'audio' },
  { name: 'Oficina', slug: 'oficina' },
  { name: 'Computación', slug: 'computacion' },
];

const products: SeedProduct[] = [
  {
    sku: 'KEYBOARD-001',
    name: 'Teclado mecánico RGB',
    description: 'Switches rojos, retroiluminado, cable trenzado de 1.8m.',
    categorySlug: 'perifericos',
    price: 79.99,
    currency: 'USD',
    imageUrl:
      'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=600&h=600&q=80',
    quantity: 40,
  },
  {
    sku: 'MOUSE-001',
    name: 'Mouse inalámbrico ergonómico',
    description: 'Sensor óptico de 16000 DPI, batería de hasta 70 horas.',
    categorySlug: 'perifericos',
    price: 34.5,
    currency: 'USD',
    imageUrl:
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=600&h=600&q=80',
    quantity: 65,
  },
  {
    sku: 'DESKMAT-001',
    name: 'Mousepad XL de escritorio',
    description: 'Superficie antideslizante de 900x400mm, base de goma.',
    categorySlug: 'oficina',
    price: 19.99,
    currency: 'USD',
    imageUrl:
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=600&h=600&q=80',
    quantity: 80,
  },
  {
    sku: 'HEADSET-001',
    name: 'Audífonos con micrófono',
    description: 'Sonido envolvente 7.1, micrófono con cancelación de ruido.',
    categorySlug: 'audio',
    price: 54.0,
    currency: 'USD',
    imageUrl:
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=600&h=600&q=80',
    quantity: 30,
  },
  {
    sku: 'MONITOR-001',
    name: 'Monitor 27" 144Hz',
    description: 'Panel IPS, 1ms de respuesta, compatible con FreeSync.',
    categorySlug: 'computacion',
    price: 249.0,
    currency: 'USD',
    imageUrl:
      'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&h=600&q=80',
    quantity: 15,
  },
  {
    sku: 'WEBCAM-001',
    name: 'Webcam Full HD',
    description: '1080p a 60fps, enfoque automático, micrófono integrado.',
    categorySlug: 'computacion',
    price: 42.9,
    currency: 'USD',
    imageUrl:
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&h=600&q=80',
    quantity: 50,
  },
  {
    sku: 'CHAIR-001',
    name: 'Silla ergonómica de oficina',
    description: 'Soporte lumbar ajustable, reposabrazos 3D, malla transpirable.',
    categorySlug: 'oficina',
    price: 189.0,
    currency: 'USD',
    imageUrl:
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=600&h=600&q=80',
    quantity: 12,
  },
  {
    sku: 'SPEAKER-001',
    name: 'Bocinas de escritorio 2.0',
    description: 'Graves reforzados, entrada USB y auxiliar de 3.5mm.',
    categorySlug: 'audio',
    price: 29.99,
    currency: 'USD',
    imageUrl:
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&h=600&q=80',
    quantity: 45,
  },
];

async function main(): Promise<void> {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB;

  if (!uri) {
    throw new Error('Missing environment variable: MONGODB_URI');
  }

  await mongoose.connect(uri, dbName ? { dbName } : {});

  const CategoryModel = mongoose.model(Category.name, CategorySchema);
  const ProductModel = mongoose.model(Product.name, ProductSchema);
  const StockModel = mongoose.model(Stock.name, StockSchema);

  const categoryIdBySlug = new Map<string, mongoose.Types.ObjectId>();

  for (const category of categories) {
    const doc = await CategoryModel.findOneAndUpdate(
      { slug: category.slug },
      { $set: { name: category.name, slug: category.slug, active: true } },
      { upsert: true, new: true },
    ).exec();

    categoryIdBySlug.set(category.slug, doc._id);
    console.log(`Category ready: ${category.name}`);
  }

  // Hide the previous "Cómputo" label so it no longer appears in the storefront nav.
  await CategoryModel.updateOne(
    { slug: 'computo' },
    { $set: { active: false } },
  ).exec();

  for (const product of products) {
    const categoryId = categoryIdBySlug.get(product.categorySlug);

    if (!categoryId) {
      throw new Error(`Unknown category slug: ${product.categorySlug}`);
    }

    await ProductModel.findOneAndUpdate(
      { sku: product.sku },
      {
        $set: {
          sku: product.sku,
          name: product.name,
          description: product.description,
          category: categoryId,
          price: product.price,
          currency: product.currency,
          imageUrl: product.imageUrl,
          active: true,
        },
      },
      { upsert: true, new: true },
    ).exec();

    await StockModel.findOneAndUpdate(
      { sku: product.sku, location: WAREHOUSE_LOCATION },
      { $setOnInsert: { quantity: product.quantity } },
      { upsert: true, new: true },
    ).exec();

    console.log(`Product ready: ${product.name}`);
  }
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
