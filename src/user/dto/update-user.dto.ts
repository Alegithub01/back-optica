import { PartialType } from '@nestjs/mapped-types';
import { AdminLoginDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(AdminLoginDto) {}
