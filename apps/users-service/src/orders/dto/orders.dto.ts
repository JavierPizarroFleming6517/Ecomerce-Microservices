import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';

export class CreateOrderItemDto {
  @IsString()
  @MaxLength(64)
  sku!: string;

  @IsString()
  @MaxLength(255)
  name!: string;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  unitPrice!: number;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity!: number;

  @IsOptional()
  @IsString()
  @MaxLength(2048)
  imageUrl?: string;
}

export class CreateOrderDto {
  @IsString()
  @MaxLength(32)
  buyOrder!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  amount!: number;

  @IsString()
  @MaxLength(3)
  currency!: string;

  @IsIn(['paid', 'failed', 'cancelled'])
  status!: 'paid' | 'failed' | 'cancelled';

  @IsOptional()
  @IsString()
  @MaxLength(64)
  authorizationCode?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items!: CreateOrderItemDto[];
}
