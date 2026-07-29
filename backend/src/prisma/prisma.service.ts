import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const initialProducts: Prisma.ProductCreateInput[] = [
  { name: 'Kopi Americano', price: 25000, stock: 50, isActive: true, category: 'Minuman', imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=120&auto=format&fit=crop&q=80' },
  { name: 'Kopi Latte', price: 32000, stock: 40, isActive: true, category: 'Minuman', imageUrl: 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=120&auto=format&fit=crop&q=80' },
  { name: 'Cappuccino', price: 32000, stock: 35, isActive: true, category: 'Minuman', imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=120&auto=format&fit=crop&q=80' },
  { name: 'Es Teh Manis', price: 10000, stock: 100, isActive: true, category: 'Minuman', imageUrl: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=120&auto=format&fit=crop&q=80' },
  { name: 'Jus Alpukat', price: 22000, stock: 30, isActive: true, category: 'Minuman', imageUrl: 'https://images.unsplash.com/photo-1623065422902-30a2d299bcc4?w=120&auto=format&fit=crop&q=80' },
  { name: 'Sandwich Tuna', price: 35000, stock: 20, isActive: true, category: 'Makanan', imageUrl: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=120&auto=format&fit=crop&q=80' },
  { name: 'Croissant', price: 28000, stock: 25, isActive: true, category: 'Snack', imageUrl: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=120&auto=format&fit=crop&q=80' },
  { name: 'Nasi Goreng', price: 45000, stock: 15, isActive: true, category: 'Makanan', imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=120&auto=format&fit=crop&q=80' },
  { name: 'Mie Goreng', price: 40000, stock: 15, isActive: true, category: 'Makanan', imageUrl: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=120&auto=format&fit=crop&q=80' },
  { name: 'Air Mineral', price: 5000, stock: 200, isActive: true, category: 'Minuman', imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=120&auto=format&fit=crop&q=80' },
  { name: 'Roti Bakar Cokelat', price: 20000, stock: 0, isActive: false, category: 'Snack', imageUrl: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=120&auto=format&fit=crop&q=80' },
];

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

      // Auto-seed initial products in background if database is empty
      this.autoSeedIfEmpty().catch((err) => {
        this.logger.warn('Auto-seed check warning:', err?.message || err);
      });
    } catch (error) {
      this.logger.error('❌ Failed to connect to database during startup:', error);
    }
  }

  private async autoSeedIfEmpty() {
    try {
      const count = await this.product.count();
      if (count === 0) {
        this.logger.log('🌱 Database is empty. Seeding initial products...');
        for (const p of initialProducts) {
          await this.product.create({ data: p });
        }
        this.logger.log(`✅ Seeded ${initialProducts.length} initial products successfully!`);
      }
    } catch (err) {
      // Table might not exist yet or connection pending
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
