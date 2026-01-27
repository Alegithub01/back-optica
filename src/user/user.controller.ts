import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { AdminLoginDto } from './dto/create-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  create(@Body() body: AdminLoginDto) {
    return this.service.create(body);
  }
}
