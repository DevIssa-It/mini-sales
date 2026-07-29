import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/transaction.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.transaction.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          select: {
            id: true,
            productName: true,
            quantity: true,
            priceAtTime: true,
            subtotal: true,
          },
        },
        _count: { select: { items: true } },
      },
    });
  }

  async findOne(id: string) {
    const transaction = await this.prisma.transaction.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, isActive: true },
            },
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Transaksi dengan ID ${id} tidak ditemukan`);
    }

    return transaction;
  }

  async checkout(dto: CreateTransactionDto) {
    const { items } = dto;

    // Fetch all products from DB — harga SELALU dari server, bukan frontend
    const productIds = items.map((i) => i.productId);
    const products = await this.prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    // Validate: semua produk ada
    const productMap = new Map(products.map((p) => [p.id, p]));
    for (const item of items) {
      if (!productMap.has(item.productId)) {
        throw new NotFoundException(
          `Produk dengan ID ${item.productId} tidak ditemukan`,
        );
      }
    }

    // Validate: semua produk aktif
    for (const item of items) {
      const product = productMap.get(item.productId)!;
      if (!product.isActive) {
        throw new BadRequestException(
          `Produk "${product.name}" sedang tidak aktif dan tidak dapat dibeli`,
        );
      }
    }

    // Validate: stok cukup
    for (const item of items) {
      const product = productMap.get(item.productId)!;
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Stok produk "${product.name}" tidak mencukupi. Tersedia: ${product.stock}, diminta: ${item.quantity}`,
        );
      }
    }

    // Hitung total server-side menggunakan harga dari DB
    let total = new Prisma.Decimal(0);
    const transactionItems = items.map((item) => {
      const product = productMap.get(item.productId)!;
      const priceAtTime = new Prisma.Decimal(product.price.toString());
      const quantity = item.quantity;
      const subtotal = priceAtTime.mul(quantity);
      total = total.add(subtotal);

      return {
        productId: product.id,
        productName: product.name, // snapshot nama
        priceAtTime,              // snapshot harga
        quantity,
        subtotal,
      };
    });

    // Atomic transaction: simpan transaksi + kurangi stok
    const transaction = await this.prisma.$transaction(async (tx) => {
      // Kurangi stok untuk setiap produk
      for (const item of items) {
        const product = productMap.get(item.productId)!;

        // Re-check stok dengan database lock untuk hindari race condition
        const freshProduct = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!freshProduct || freshProduct.stock < item.quantity) {
          throw new BadRequestException(
            `Stok produk "${product.name}" tidak mencukupi (race condition terdeteksi)`,
          );
        }

        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Buat transaksi dan items
      return tx.transaction.create({
        data: {
          total,
          items: {
            create: transactionItems,
          },
        },
        include: {
          items: true,
        },
      });
    });

    return transaction;
  }
}
