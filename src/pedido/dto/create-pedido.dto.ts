import { IsNotEmpty, IsNumber, IsOptional, IsString, IsDateString } from 'class-validator';

export class CreatePedidoDto {
  @IsNotEmpty()
  envio_pais: string;

  @IsNotEmpty()
  envio_estado: string;

  @IsNotEmpty()
  direccion: string;

  @IsNotEmpty()
  nombre_destinatario: string;

  @IsNotEmpty()
  numero_celular: string;

  items: {
    productoId: number;
    cantidad: number;
  }[];
}

