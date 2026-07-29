import {
  IsArray,
  IsString,
  IsInt,
  ValidateNested,
  ArrayMinSize,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CartItemDto {
  @IsString()
  productId: string;

  @IsInt({ message: 'Jumlah harus berupa bilangan bulat' })
  @Min(1, { message: 'Jumlah minimal 1' })
  quantity: number;
}

export class CreateTransactionDto {
  @IsArray()
  @ArrayMinSize(1, { message: 'Keranjang tidak boleh kosong' })
  @ValidateNested({ each: true })
  @Type(() => CartItemDto)
  items: CartItemDto[];
}
