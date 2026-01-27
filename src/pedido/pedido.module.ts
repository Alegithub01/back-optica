import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PedidoService } from './pedido.service';
import { PedidoController } from './pedido.controller';
import { Pedido } from './entities/pedido.entity';
import { Producto } from '../producto/entities/producto.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Pedido, Producto])],
    controllers: [PedidoController],
    providers: [PedidoService],
})
export class PedidoModule { }
