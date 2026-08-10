import { Injectable } from '@nestjs/common';
import {
  type CrossSellingRecommendation,
  GraphRepository,
} from '../graph/graph.repository';

@Injectable()
export class RecommendationsService {
  constructor(private readonly graphRepository: GraphRepository) {}

  getCrossSelling(
    productId: string,
    requestedLimit: number,
  ): Promise<CrossSellingRecommendation[]> {
    // Enfoque CO-COMPRA: delega en Neo4j el score de compras compartidas.
    const limit = Math.min(Math.max(requestedLimit, 1), 50);
    return this.graphRepository.findCrossSelling(productId, limit);
  }
}
