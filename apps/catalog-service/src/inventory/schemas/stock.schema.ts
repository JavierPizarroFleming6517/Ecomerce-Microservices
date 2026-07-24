import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { type HydratedDocument, type Types } from 'mongoose';

export type StockDocument = HydratedDocument<Stock>;

@Schema({
  timestamps: true,
  optimisticConcurrency: true,
  versionKey: 'version',
})
export class Stock {
  declare _id: Types.ObjectId;

  @Prop({ required: true, uppercase: true, trim: true })
  sku!: string;

  @Prop({ required: true, uppercase: true, trim: true })
  location!: string;

  @Prop({ required: true, min: 0, default: 0 })
  quantity!: number;

  declare version: number;
}

export const StockSchema = SchemaFactory.createForClass(Stock);

StockSchema.index({ sku: 1, location: 1 }, { unique: true });
StockSchema.index({ location: 1, quantity: 1 });
