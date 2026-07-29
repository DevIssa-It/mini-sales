import { Module } from '@nestjs/common';
import { ProductsModule } from './products/products.module';
import { TransactionsModule } from './transactions/transactions.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, ProductsModule, TransactionsModule],
})
export class AppModule {}
