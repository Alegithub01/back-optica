import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Controller('productos')
export class ProductoController {
  constructor(private readonly service: ProductoService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.service.findOne(+id);
  }

  @Get('categoria/:categoria_id')
  findByCategoria(@Param('categoria_id') categoria_id: number) {
    return this.service.findByCategoria(+categoria_id);
  }

  @Post()
  create(@Body() body: CreateProductoDto) {
    return this.service.create(body);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() body: UpdateProductoDto) {
    return this.service.update(+id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.service.delete(+id);
  }
}
