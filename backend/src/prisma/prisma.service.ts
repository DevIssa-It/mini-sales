import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const connectionString =
      process.env.DATABASE_URL ||
      process.env.DATABASE_PUBLIC_URL ||
      'postgresql://postgres:postgres@localhost:5432/minipos?schema=public';

    const isExplicitSslDisable = connectionString.includes('sslmode=disable');
    const isInternalRailway = connectionString.includes('railway.internal');
    const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

    const needsSsl =
      !isExplicitSslDisable &&
      !isInternalRailway &&
      !isLocalhost &&
      (connectionString.includes('.rlwy.net') || process.env.DATABASE_SSL === 'true');

    const adapter = new PrismaPg({
      connectionString,
      ssl: needsSsl ? { rejectUnauthorized: false } : false,
    });

    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Successfully connected to PostgreSQL database via Prisma');
    } catch (error) {
      this.logger.error('❌ Failed to connect to database during startup:', error);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
