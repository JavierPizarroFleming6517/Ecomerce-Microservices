import { Injectable } from '@nestjs/common';
import { type Integer } from 'neo4j-driver';
import { Neo4jService } from '../neo4j/neo4j.service';

export interface CrossSellingRecommendation {
  productId: string;
  name: string;
  score: number;
}

@Injectable()
export class GraphRepository {
  constructor(private readonly neo4j: Neo4jService) {}

  async findCrossSelling(
    productId: string,
    limit: number,
  ): Promise<CrossSellingRecommendation[]> {
    // ---------------------------------------------------------------------------
    // Enfoque CO-COMPRA (collaborative filtering / cross-selling):
    // Parte del producto actual, sube a clientes que lo compraron y baja a otros
    // productos que esos mismos clientes también compraron. El score es cuántos
    // clientes distintos hacen ese puente.
    // ---------------------------------------------------------------------------
    return this.neo4j.executeRead(async (transaction) => {
      const result = await transaction.run(
        `
          MATCH (source:Product {id: $productId})
            <-[:PURCHASED]-(customer:Customer)-[:PURCHASED]->
            (recommended:Product)
          WHERE recommended <> source
          WITH recommended, count(DISTINCT customer) AS score
          RETURN recommended.id AS productId,
                 recommended.name AS name,
                 score
          ORDER BY score DESC, productId ASC
          LIMIT $limit
        `,
        { productId, limit },
      );

      return result.records.map((record) => ({
        productId: record.get('productId') as string,
        name: record.get('name') as string,
        score: this.toNumber(record.get('score') as number | Integer),
      }));
    });
  }

  private toNumber(value: number | Integer): number {
    return typeof value === 'number' ? value : value.toNumber();
  }
}
