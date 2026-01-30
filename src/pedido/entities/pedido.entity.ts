import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Producto } from 'src/producto/entities/producto.entity';
import { PagoEstado } from '../enums/pago-estado.enum';
import { DetallePedido } from './detalle-pedido.entity';

@Entity()
export class Pedido {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    fecha: Date;

    @Column()
    envio_pais: string;

    @Column()
    envio_estado: string;

    @Column()
    direccion: string;

    @Column()
    nombre_destinatario: string;

    @Column()
    numero_celular: string;

     // 🔥 Nuevo: opción de recojo en sucursal
    @Column({ default: false })
    recojo_sucursal: boolean;

    // 🔥 Nuevo: link de Google Maps
    @Column({ nullable: true })
    google_maps_link?: string;

    // 🔥 ESTADO DE PAGO
    @Column({
        type: 'enum',
        enum: PagoEstado,
        default: PagoEstado.PENDIENTE,
    })
    pago_estado: PagoEstado;

    // 📎 comprobante (opcional)
    @Column({ nullable: true })
    comprobante_url?: string;

    @OneToMany(() => DetallePedido, detalle => detalle.pedido, {
    cascade: true,
    eager: true,
    })
    detalles: DetallePedido[];

    @Column('decimal')
    total: number;

}
