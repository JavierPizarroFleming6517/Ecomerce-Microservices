import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, Types } from 'mongoose';

export type CategoryDocument = HydratedDocument<Category>;

@Schema({ timestamps: true, versionKey: 'version' })
export class Category {
  declare _id: Types.ObjectId;

  @Prop({ required: true, trim: true })
  name!: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  slug!: string;

  @Prop({ type: Types.ObjectId, ref: Category.name, default: null })
  parentId!: Types.ObjectId | null;

  @Prop({ default: true })
  active!: boolean;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index({ parentId: 1, active: 1 });
