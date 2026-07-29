import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(activeOnly?: boolean) {
    const where = activeOnly ? { isActive: true } : {};
    return this.prisma.product.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Produk dengan ID ${id} tidak ditemukan`);
    }
    return product;
  }

  async create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        price: dto.price,
        stock: dto.stock,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findOne(id); // throws NotFoundException if not found
    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }

  async toggleStatus(id: string) {
    const product = await this.findOne(id);
    return this.prisma.product.update({
      where: { id },
      data: { isActive: !product.isActive },
    });
  }
}
