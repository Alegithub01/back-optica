import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  async create(data) {
    const hashed = await bcrypt.hash(data.password, 10);

    const user = this.repo.create({
      ...data,
      password: hashed,
    });

    return this.repo.save(user);
  }

  findByUsername(username: string) {
    return this.repo.findOne({ where: { username } });
  }
}