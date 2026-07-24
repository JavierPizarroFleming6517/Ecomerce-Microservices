import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createNestPinoOptions, LoggerModule } from '@retail/logger';
import * as Joi from 'joi';
import { GraphModule } from './graph/graph.module';
import { HealthModule } from './health/health.module';
import { Neo4jModule } from './neo4j/neo4j.module';
import { RecommendationsModule } from './recommendations/recommendations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      validationSchema: Joi.object({
        PORT: Joi.number().port().default(3003),
        NEO4J_URI: Joi.string()
          .uri({ scheme: ['neo4j', 'neo4j+s', 'bolt', 'bolt+s'] })
          .required(),
        NEO4J_USERNAME: Joi.string().required(),
        NEO4J_PASSWORD: Joi.string().required(),
        NEO4J_DATABASE: Joi.string().default('neo4j'),
      }),
    }),
    LoggerModule.forRoot(
      createNestPinoOptions({ serviceName: 'recommendations-service' }),
    ),
    Neo4jModule,
    GraphModule,
    RecommendationsModule,
    HealthModule,
  ],
})
export class AppModule {}
