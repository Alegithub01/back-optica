// create-producto.dto.ts
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  name: string;

  @IsNumber()
  price: number;

  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsOptional()
  @IsString()
  marca?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsNumber()
  categoria_id: number;
}