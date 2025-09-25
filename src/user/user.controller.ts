import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Roles(Role.SUPERADMIN)
  create(
    @Body()
    createUserDto: {
      name: string;
      email: string;
      password: string;
      role?: Role;
      companyId?: string;
    },
  ) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(Role.SUPERADMIN)
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateUserDto: Partial<{
      name: string;
      email: string;
      password: string;
      role: Role;
      companyId: string;
    }>,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.SUPERADMIN)
  remove(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
