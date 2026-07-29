import {
  IsString,
  IsNumber,
  IsInt,
  IsOptional,
  IsBoolean,
  Min,
  MinLength,
  MaxLength,
  IsPositive,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1, { message: 'Nama produk tidak boleh kosong' })
  @MaxLength(100, { message: 'Nama produk maksimal 100 karakter' })
  name: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Harga harus berupa angka' })
  @IsPositive({ message: 'Harga harus lebih dari 0' })
  price: number;

  @IsInt({ message: 'Stok harus berupa bilangan bulat' })
  @Min(0, { message: 'Stok tidak boleh negatif' })
  stock: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}

export class UpdateProductDto {
  @IsString()
  @MinLength(1, { message: 'Nama produk tidak boleh kosong' })
  @MaxLength(100, { message: 'Nama produk maksimal 100 karakter' })
  @IsOptional()
  name?: string;

  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Harga harus berupa angka' })
  @IsPositive({ message: 'Harga harus lebih dari 0' })
  @IsOptional()
  price?: number;

  @IsInt({ message: 'Stok harus berupa bilangan bulat' })
  @Min(0, { message: 'Stok tidak boleh negatif' })
  @IsOptional()
  stock?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
