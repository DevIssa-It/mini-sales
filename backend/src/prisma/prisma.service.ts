import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const connectionString =
      process.env.DATABASE_URL ||
      process.env.DATABASE_PUBLIC_URL ||
      'postgresql://postgres:postgres@localhost:5432/minipos?schema=public';

    const isProduction =
      process.env.NODE_ENV === 'production' ||
      connectionString.includes('railway') ||
      connectionString.includes('.rlwy.net');

    const pool = new Pool({
      connectionString,
      ssl: isProduction ? { rejectUnauthorized: false } : false,
    });

    const adapter = new PrismaPg(pool);
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
      console.log('✅ Successfully connected to PostgreSQL database via Prisma');
    } catch (error) {
      console.error('❌ Failed to connect to database:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
