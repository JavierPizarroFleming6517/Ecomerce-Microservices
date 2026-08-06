import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateTransactionDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  amount!: number;

  @IsOptional()
  @IsString()
  @MaxLength(26)
  buyOrder?: string;

  @IsOptional()
  @IsString()
  @MaxLength(61)
  sessionId?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  returnUrl?: string;
}

export class CommitTransactionDto {
  @IsString()
  token!: string;
}
