import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, SchemaTypes, Types } from 'mongoose';
import { Category } from '../../categories/schemas/category.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({ timestamps: true, versionKey: 'version' })
export class Product {
  declare _id: Types.ObjectId;

  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  sku!: string;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ trim: true, default: '' })
  description!: string;

  @Prop({ type: Types.ObjectId, ref: Category.name, required: true })
  category!: Types.ObjectId;

  @Prop({ type: Map, of: SchemaTypes.Mixed, default: {} })
  attributes!: Map<string, unknown>;

  @Prop({ required: true, min: 0 })
  price!: number;

  @Prop({ required: true, uppercase: true, trim: true, minlength: 3 })
  currency!: string;

  @Prop({ trim: true, default: '' })
  imageUrl!: string;

  @Prop({ default: true })
  active!: boolean;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.index({ name: 'text', description: 'text' });
ProductSchema.index({ category: 1, active: 1 });
ProductSchema.index({ price: 1, active: 1 });
