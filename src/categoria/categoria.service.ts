// src/categoria/categoria.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Categoria } from './entities/categoria.entity';
import { CreateCategoriaDto } from './dto/create-categoria.dto';
import { UpdateCategoriaDto } from './dto/update-categoria.dto';

function normalizeForPath(name: string) {
  return name
    .normalize('NFD')                 // separa los acentos
    .replace(/[\u0300-\u036f]/g, '')  // elimina diacríticos
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')     // quita caracteres inválidos
    .replace(/\s+/g, '-')             // espacios -> guiones
    .replace(/-+/g, '-');             // guiones repetidos -> uno
}

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private readonly categoriaRepo: Repository<Categoria>,
  ) {}

  async findAll(): Promise<Categoria[]> {
    return this.categoriaRepo.find({ relations: ['productos'] });
  }

  async findOne(id: number): Promise<Categoria> {
    const cat = await this.categoriaRepo.findOne({ 
      where: { id }, 
      relations: ['productos'] 
    });
    if (!cat) throw new NotFoundException('Categoria no encontrada');
    return cat;
  }

  async create(data: CreateCategoriaDto): Promise<Categoria> {
    // Normalizamos el nombre (sin espacios, minúsculas)
    const normalizedName = data.name.trim().toLowerCase().replace(/\s+/g, '-');

    // Generamos la ruta
    const imagePath = `${normalizedName}.png`;

    const cat = this.categoriaRepo.create({
      ...data,
      image: imagePath,
    });

    return this.categoriaRepo.save(cat);
  }

  async update(id: number, data: UpdateCategoriaDto): Promise<Categoria> {
    const cat = await this.findOne(id);

    // Determinar el nombre final que tendrá la categoría
    const finalName = (typeof data.name === 'string' && data.name.trim().length > 0)
      ? data.name
      : cat.name;

    // Normalizar y regenerar la ruta de la imagen basada en el nombre final
    const normalizedName = normalizeForPath(finalName);
    cat.image = `${normalizedName}.png`;

    // Asignar el resto de campos del DTO excepto image (porque la generamos)
    const { image, ...rest } = data as any;
    Object.assign(cat, rest);

    // Asegurarse de que el nombre también se actualice en la entidad
    cat.name = finalName;

    return this.categoriaRepo.save(cat);
  }

  async remove(id: number): Promise<void> {
    const cat = await this.findOne(id);
    await this.categoriaRepo.remove(cat);
  }
}
