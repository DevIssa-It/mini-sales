import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from 'src/products/products.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

// Mock PrismaService
const mockPrisma = {
  product: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('harus mengembalikan semua produk ketika activeOnly = false', async () => {
      const mockProducts = [
        { id: '1', name: 'Kopi', price: 25000, stock: 10, isActive: true },
        { id: '2', name: 'Teh', price: 10000, stock: 0, isActive: false },
      ];
      mockPrisma.product.findMany.mockResolvedValue(mockProducts);

      const result = await service.findAll(false);

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        where: {},
        orderBy: { createdAt: 'desc' },
      });
      expect(result).toEqual(mockProducts);
    });

    it('harus memfilter hanya produk aktif ketika activeOnly = true', async () => {
      const mockProducts = [
        { id: '1', name: 'Kopi', price: 25000, stock: 10, isActive: true },
      ];
      mockPrisma.product.findMany.mockResolvedValue(mockProducts);

      await service.findAll(true);

      expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('findOne', () => {
    it('harus melempar NotFoundException jika produk tidak ditemukan', async () => {
      mockPrisma.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne('nonexistent-id')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('harus mengembalikan produk jika ditemukan', async () => {
      const mockProduct = { id: '1', name: 'Kopi', price: 25000 };
      mockPrisma.product.findUnique.mockResolvedValue(mockProduct);

      const result = await service.findOne('1');
      expect(result).toEqual(mockProduct);
    });
  });

  describe('create', () => {
    it('harus membuat produk baru dengan data yang benar', async () => {
      const dto = { name: 'Espresso', price: 20000, stock: 30 };
      const mockCreated = { id: 'new-id', ...dto, isActive: true };
      mockPrisma.product.create.mockResolvedValue(mockCreated);

      const result = await service.create(dto);
      expect(result).toEqual(mockCreated);
      expect(mockPrisma.product.create).toHaveBeenCalledWith({
        data: { name: dto.name, price: dto.price, stock: dto.stock, isActive: true },
      });
    });
  });

  describe('toggleStatus', () => {
    it('harus mengubah isActive dari true ke false', async () => {
      const mockProduct = { id: '1', name: 'Kopi', isActive: true };
      mockPrisma.product.findUnique.mockResolvedValue(mockProduct);
      mockPrisma.product.update.mockResolvedValue({ ...mockProduct, isActive: false });

      const result = await service.toggleStatus('1');
      expect(result.isActive).toBe(false);
      expect(mockPrisma.product.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { isActive: false },
      });
    });
  });
});
