import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

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

    // Only force SSL if explicitly requested or connecting via public remote SSL domain (.rlwy.net)
    // Avoid enabling SSL on internal Railway network (*.railway.internal) or when sslmode=disable is set
    const isExplicitSslDisable = connectionString.includes('sslmode=disable');
    const isInternalRailway = connectionString.includes('railway.internal');
    const isLocalhost = connectionString.includes('localhost') || connectionString.includes('127.0.0.1');

    const needsSsl =
      !isExplicitSslDisable &&
      !isInternalRailway &&
      !isLocalhost &&
      (connectionString.includes('.rlwy.net') || process.env.DATABASE_SSL === 'true');

    const pool = new Pool({
      connectionString,
      ssl: needsSsl ? { rejectUnauthorized: false } : false,
    });

    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Successfully connected to PostgreSQL database via Prisma');
    } catch (error) {
      this.logger.error('❌ Failed to connect to database during startup:', error);
      // Do not crash NestJS process immediately so the server stays up to return proper JSON error responses with CORS headers
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
