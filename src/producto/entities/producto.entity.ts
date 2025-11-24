import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Categoria } from 'src/categoria/entities/categoria.entity';

@Entity()
export class Producto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('decimal')
  price: number;

  @Column()
  image: string;

  @Column({ nullable: true })
  color: string;

  @Column({ nullable: true })
  marca: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @ManyToOne(() => Categoria, (categoria) => categoria.productos, {
    eager: true,
  })
  categoria: Categoria;
}
