import { Controller, Post, Body } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AdminLoginDto } from './dto/admin-login.dto'

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('admin/login')
  login(@Body() dto: AdminLoginDto) {
    return this.authService.adminLogin(dto.username, dto.password)
  }
}
