import {
  Injectable,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import neo4j, {
  type Driver,
  type ManagedTransaction,
  type SessionMode,
} from 'neo4j-driver';

@Injectable()
export class Neo4jService implements OnModuleInit, OnModuleDestroy {
  private readonly driver: Driver;
  private readonly database: string;

  constructor(config: ConfigService) {
    this.database = config.getOrThrow<string>('NEO4J_DATABASE');
    this.driver = neo4j.driver(
      config.getOrThrow<string>('NEO4J_URI'),
      neo4j.auth.basic(
        config.getOrThrow<string>('NEO4J_USERNAME'),
        config.getOrThrow<string>('NEO4J_PASSWORD'),
      ),
    );
  }

  async onModuleInit(): Promise<void> {
    await this.verifyConnectivity();
  }

  async onModuleDestroy(): Promise<void> {
    await this.driver.close();
  }

  async verifyConnectivity(): Promise<void> {
    await this.driver.verifyConnectivity({ database: this.database });
  }

  async executeRead<T>(
    work: (transaction: ManagedTransaction) => Promise<T>,
  ): Promise<T> {
    return this.execute(neo4j.session.READ, (session) =>
      session.executeRead(work),
    );
  }

  async executeWrite<T>(
    work: (transaction: ManagedTransaction) => Promise<T>,
  ): Promise<T> {
    return this.execute(neo4j.session.WRITE, (session) =>
      session.executeWrite(work),
    );
  }

  private async execute<T>(
    mode: SessionMode,
    work: (session: ReturnType<Driver['session']>) => Promise<T>,
  ): Promise<T> {
    const session = this.driver.session({
      database: this.database,
      defaultAccessMode: mode,
    });

    try {
      return await work(session);
    } finally {
      await session.close();
    }
  }
}
