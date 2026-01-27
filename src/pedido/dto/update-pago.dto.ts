// dto/update-pago.dto.ts
import { IsBoolean } from 'class-validator';

export class UpdatePagoDto {
    @IsBoolean()
    pagado: boolean;
}
