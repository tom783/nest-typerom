import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from './auth.entity';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { createUserDto } from './dto/create-user.dto';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
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

  @Post('/signin')
  signIn(
    @Body() authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: String }> {
    return this.authService.signIn(authCredentialDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/test')
  test(@GetUser() user: UserEntity) {
    console.log('req', user);
  }
}
