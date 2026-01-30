import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Pedido } from './entities/pedido.entity';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { Producto } from '../producto/entities/producto.entity';
import { PagoEstado } from './enums/pago-estado.enum';
import { DetallePedido } from './entities/detalle-pedido.entity';

@Injectable()
export class PedidoService {
    constructor(
        @InjectRepository(Pedido)
        private readonly pedidoRepository: Repository<Pedido>,
        @InjectRepository(Producto)
        private readonly productoRepository: Repository<Producto>,
    ) { }

    async create(dto: CreatePedidoDto) {
        let total = 0;
        const detalles: DetallePedido[] = [];

        for (const item of dto.items) {
        const producto = await this.productoRepository.findOneBy({
            id: item.productoId,
        });

        if (!producto) {
            throw new NotFoundException(`Producto ${item.productoId} no existe`);
        }

        const subtotal = producto.price * item.cantidad;
        total += subtotal;

        const detalle = new DetallePedido();
        detalle.producto = producto;
        detalle.cantidad = item.cantidad;
        detalle.precio_unitario = producto.price;
        detalle.subtotal = subtotal;

        detalles.push(detalle);
        }

        const pedido = this.pedidoRepository.create({
            envio_pais: dto.envio_pais,
            envio_estado: dto.envio_estado,
            direccion: dto.direccion,
            nombre_destinatario: dto.nombre_destinatario,
            numero_celular: dto.numero_celular,
            total,
            detalles,
            recojo_sucursal: dto.recojo_sucursal ?? false,
            google_maps_link: dto.google_maps_link ?? undefined
        });

        return this.pedidoRepository.save(pedido);
        }


    findAll() {
        return this.pedidoRepository.find({
            relations: ['detalles', 'detalles.producto'],
        });
    }

    findByDay(fecha: string) {
        // fecha string 'YYYY-MM-DD'
        return this.pedidoRepository.find({
            where: { fecha: new Date(fecha) },
            relations: ['detalles', 'detalles.producto'],
        });
    }

    findByWeek(fecha: string) {
        // Find start and end of the week for the given date
        const date = new Date(fecha);
        const day = date.getDay(); // 0 (Sun) to 6 (Sat)

        // Calculate start (Monday) and end (Sunday) - adjusting to make Monday first day if desired, or Sunday.
        // Let's assume standard Sunday-Saturday week or similar.
        // Actually, simple approach: Start = date - day, End = start + 6
        const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
        const monday = new Date(date.setDate(diff));
        const sunday = new Date(date.setDate(monday.getDate() + 6));

        // reset times for safety (though type is date)
        monday.setHours(0, 0, 0, 0);
        sunday.setHours(23, 59, 59, 999);

        return this.pedidoRepository.find({
            where: {
                fecha: Between(monday, sunday),
            },
            relations: ['detalles', 'detalles.producto'],
        });
    }

    findByMonth(year: number, month: number) {
        // month is 1-12
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0); // Last day of month

        return this.pedidoRepository.find({
            where: {
                fecha: Between(startDate, endDate),
            },
            relations: ['detalles', 'detalles.producto'],
        });
    }

    findByYear(year: number) {
        const startDate = new Date(year, 0, 1);
        const endDate = new Date(year, 11, 31);

        return this.pedidoRepository.find({
            where: {
                fecha: Between(startDate, endDate),
            },
            relations: ['detalles', 'detalles.producto'],
        });
    }

    findByRange(start: string, end: string) {
        return this.pedidoRepository.find({
            where: {
                fecha: Between(new Date(start), new Date(end)),
            },
            relations: ['detalles', 'detalles.producto'],
        });
    }

    async confirmarPago(
    id: number,
    pago_estado: PagoEstado,
    ) {
    const pedido = await this.pedidoRepository.findOne({
        where: { id },
    });

    if (!pedido) {
        throw new NotFoundException(`Pedido con ID ${id} no encontrado`);
    }

    pedido.pago_estado = pago_estado;

    return this.pedidoRepository.save(pedido);
    }

    // pedido.service.ts
async guardarComprobante(pedidoId: number, url: string) {
  const pedido = await this.pedidoRepository.findOne({ where: { id: pedidoId } });
  if (!pedido) throw new NotFoundException(`Pedido con ID ${pedidoId} no encontrado`);

  pedido.comprobante_url = url;
  pedido.pago_estado = PagoEstado.EN_REVISION; // mantiene pendiente hasta que admin confirme
  await this.pedidoRepository.save(pedido);
  return pedido;
}

}
