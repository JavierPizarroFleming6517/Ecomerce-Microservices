import { Module } from '@nestjs/common';

import { InternalHttpModule } from '../internal/internal-http.module';
import { CatalogController } from './catalog.controller';

@Module({
  imports: [InternalHttpModule],
  controllers: [CatalogController],
})
export class CatalogModule {}
