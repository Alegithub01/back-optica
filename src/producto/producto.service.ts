import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { Categoria } from 'src/categoria/entities/categoria.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';

@Injectable()
export class ProductoService {
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepo: Repository<Producto>,

    @InjectRepository(Categoria)
    private readonly categoriaRepo: Repository<Categoria>,
  ) {}

  async findAll() {
    return this.productoRepo.find();
  }

  async findOne(id: number) {
    const producto = await this.productoRepo.findOne({ where: { id } });
    if (!producto) throw new NotFoundException('Producto no encontrado');
    return producto;
  }

  async findByCategoria(categoria_id: number) {
    const categoria = await this.categoriaRepo.findOne({ where: { id: categoria_id } });
    if (!categoria) throw new NotFoundException('Categoría no encontrada');
    return this.productoRepo.find({ where: { categoria } });
  }

  async create(data: CreateProductoDto) {
    const categoria = await this.categoriaRepo.findOne({ where: { id: data.categoria_id } });
    if (!categoria) throw new NotFoundException('Categoría no encontrada');

    const producto = this.productoRepo.create({ ...data, categoria });
    return this.productoRepo.save(producto);
  }

  async update(id: number, data: UpdateProductoDto) {
    const producto = await this.findOne(id);
    if (data.categoria_id) {
      const categoria = await this.categoriaRepo.findOne({ where: { id: data.categoria_id } });
      if (!categoria) throw new NotFoundException('Categoría no encontrada');
      producto.categoria = categoria;
    }
    Object.assign(producto, data);
    return this.productoRepo.save(producto);
  }

  async delete(id: number) {
    const producto = await this.findOne(id);
    return this.productoRepo.remove(producto);
  }
}
