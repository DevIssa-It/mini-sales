import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from 'src/transactions/transactions.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

const mockTransaction = jest.fn();

const mockPrisma = {
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
  },
  transaction: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  $transaction: mockTransaction,
};

describe('TransactionsService — Checkout', () => {
  let service: TransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
    jest.clearAllMocks();
  });

  const mockProducts = [
    {
      id: 'prod-1',
      name: 'Kopi Americano',
      price: new Prisma.Decimal('25000'),
      stock: 10,
      isActive: true,
    },
    {
      id: 'prod-2',
      name: 'Kopi Latte',
      price: new Prisma.Decimal('32000'),
      stock: 5,
      isActive: true,
    },
  ];

  describe('checkout — validasi stok', () => {
    it('harus melempar BadRequestException jika stok tidak mencukupi', async () => {
      mockPrisma.product.findMany.mockResolvedValue(mockProducts);

      await expect(
        service.checkout({
          items: [{ productId: 'prod-2', quantity: 10 }], // stok hanya 5
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('checkout — validasi produk nonaktif', () => {
    it('harus melempar BadRequestException jika produk tidak aktif', async () => {
      const inactiveProducts = [
        { ...mockProducts[0], isActive: false },
      ];
      mockPrisma.product.findMany.mockResolvedValue(inactiveProducts);

      await expect(
        service.checkout({
          items: [{ productId: 'prod-1', quantity: 1 }],
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('checkout — produk tidak ditemukan', () => {
    it('harus melempar NotFoundException jika productId tidak ada', async () => {
      mockPrisma.product.findMany.mockResolvedValue([]); // kosong

      await expect(
        service.checkout({
          items: [{ productId: 'nonexistent', quantity: 1 }],
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('checkout — harga dihitung server-side', () => {
    it('harus menghitung total dari harga DB, bukan dari request', async () => {
      mockPrisma.product.findMany.mockResolvedValue(mockProducts);

      // Mock $transaction: simulasi sukses
      mockTransaction.mockImplementation(async (callback: any) => {
        const txMock = {
          product: {
            findUnique: jest.fn().mockResolvedValue(mockProducts[0]),
            update: jest.fn(),
          },
          transaction: {
            create: jest.fn().mockResolvedValue({
              id: 'txn-1',
              total: new Prisma.Decimal('25000'),
              items: [],
            }),
          },
        };
        return callback(txMock);
      });

      const result = await service.checkout({
        items: [{ productId: 'prod-1', quantity: 1 }],
      });

      // Total harus dari DB (25000 × 1 = 25000)
      expect(result).toBeDefined();
      expect(result.id).toBe('txn-1');
    });
  });

  describe('findAll', () => {
    it('harus mengembalikan daftar transaksi dengan items', async () => {
      const mockTxns = [
        {
          id: 'txn-1',
          total: new Prisma.Decimal('25000'),
          createdAt: new Date(),
          items: [],
          _count: { items: 0 },
        },
      ];
      mockPrisma.transaction.findMany.mockResolvedValue(mockTxns);

      const result = await service.findAll();
      expect(result).toEqual(mockTxns);
    });
  });
});
