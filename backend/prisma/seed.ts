import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/minipos?schema=public';
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const products: (Prisma.ProductCreateInput & { imageUrl?: string; category?: string })[] = [
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

async function main() {
  console.log('🌱 Seeding database with categories...');

  // Clear existing data
  await prisma.transactionItem.deleteMany();
  await prisma.transaction.deleteMany();
  await prisma.product.deleteMany();

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log(`✅ Seeded ${products.length} initial products successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
