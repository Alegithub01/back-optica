import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  Param,
  Patch,
  ParseIntPipe,
  UploadedFile,
  BadRequestException,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { PedidoService } from './pedido.service';
import { CreatePedidoDto } from './dto/create-pedido.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ConfirmarPagoDto } from './dto/confirmar-pago.dto';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/guards/roles.decorator';
import { UserRole } from 'src/user/entities/user.entity';

@Controller('pedidos')
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  // ======================
  // 🌐 RUTAS PÚBLICAS
  // ======================

  // Crear pedido (cliente)
  @Post()
  create(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidoService.create(createPedidoDto);
  }

  // Subir comprobante (cliente)
  @Post(':id/comprobante')
  @UseInterceptors(
    FileInterceptor('comprobante', {
      storage: diskStorage({
        destination: './uploads/comprobantes',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(
            null,
            `pedido-${req.params.id}-${uniqueSuffix}${extname(
              file.originalname,
            )}`,
          );
        },
      }),
      fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
          return cb(
            new BadRequestException('Solo se permiten JPG, PNG y PDF'),
            false,
          );
        }
        cb(null, true);
      },
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  async subirComprobante(
    @Param('id', ParseIntPipe) id: number,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No se recibió ningún archivo');

    const url = `/uploads/comprobantes/${file.filename}`;
    return this.pedidoService.guardarComprobante(id, url);
  }

  // ======================
  // 🔐 RUTAS ADMIN
  // ======================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  findAll() {
    return this.pedidoService.findAll();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('dia')
  findByDay(@Query('fecha') fecha: string) {
    return this.pedidoService.findByDay(fecha);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('semana')
  findByWeek(@Query('fecha') fecha: string) {
    return this.pedidoService.findByWeek(fecha);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('mes')
  findByMonth(
    @Query('year') year: number,
    @Query('month') month: number,
  ) {
    return this.pedidoService.findByMonth(year, month);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('anio')
  findByYear(@Query('year') year: number) {
    return this.pedidoService.findByYear(year);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get('rango')
  findByRange(
    @Query('inicio') start: string,
    @Query('fin') end: string,
  ) {
    return this.pedidoService.findByRange(start, end);
  }

  // Confirmar pago (CRÍTICO)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Patch(':id/confirmar-pago')
  confirmarPago(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ConfirmarPagoDto,
  ) {
    return this.pedidoService.confirmarPago(id, dto.pago_estado);
  }
}
