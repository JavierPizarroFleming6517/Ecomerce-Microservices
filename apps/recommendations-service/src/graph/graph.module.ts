import { Module } from '@nestjs/common';
import { GraphRepository } from './graph.repository';

@Module({
  providers: [GraphRepository],
  exports: [GraphRepository],
})
export class GraphModule {}
