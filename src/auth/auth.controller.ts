import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserEntity } from './auth.entity';
import { AuthService } from './auth.service';
import { createUserDto } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  createUser(@Body() createUserDto: createUserDto): Promise<UserEntity> {
    return this.authService.createUser(createUserDto);
  }

  @Get()
  getAllUser(): Promise<UserEntity[]> {
    return this.authService.getAllUser();
  }

  @Get('/:id')
  getUserById(@Param('id') id: Number): Promise<UserEntity> {
    return this.authService.getUserById(id);
  }

  @Patch('/:id')
  updateUserPassword(
    @Param('id') id: Number,
    @Body('password') password: String,
  ): Promise<UserEntity> {
    return this.authService.updateUserPassword(id, password);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: Number): Promise<void> {
    return this.authService.deleteUser(id);
  }
}
