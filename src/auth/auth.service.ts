import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import * as bcrypt from 'bcrypt'
import { User, UserRole } from '../user/entities/user.entity'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async adminLogin(username: string, password: string) {
    const admin = await this.userRepo.findOne({ where: { username } })

    if (!admin || admin.role !== UserRole.ADMIN) {
      throw new UnauthorizedException('No autorizado')
    }

    const valid = await bcrypt.compare(password, admin.password)
    if (!valid) {
      throw new UnauthorizedException('Credenciales incorrectas')
    }

    const payload = {
      sub: admin.id,
      username: admin.username,
      role: admin.role,
    }

    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
