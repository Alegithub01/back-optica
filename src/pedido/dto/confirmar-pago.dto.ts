import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PagoEstado } from '../enums/pago-estado.enum';

export class ConfirmarPagoDto {
  @IsEnum(PagoEstado)
  pago_estado: PagoEstado;

  @IsOptional()
  @IsString()
  observacion?: string;
}
