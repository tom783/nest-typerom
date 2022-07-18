import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './auth.entity';
import { createUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { AuthCredentialDto } from './dto/auth-credential.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private authRepository: Repository<UserEntity>,
    private jwtService: JwtService,
  ) {}

  async createUser(createUserDto: createUserDto): Promise<UserEntity> {
    const { username, password } = createUserDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.authRepository.create({
      username,
      password,
      hashedPassword,
    });
    try {
      await this.authRepository.save(user);
      return user;
    } catch (e) {
      if (e.code === '23505') {
        throw new ConflictException('Existing username');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async getAllUser(): Promise<UserEntity[]> {
    return await this.authRepository.find();
  }

  async getUserById(id: Number): Promise<UserEntity> {
    //@ts-ignore
    const user = await this.authRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`Not found user ${id}`);
    }
    return user;
  }

  async updateUserPassword(id: Number, password: String): Promise<UserEntity> {
    //@ts-ignore
    const user = await this.getUserById(id);
    user.password = password;
    await this.authRepository.save(user);
    return user;
  }

  async deleteUser(id: Number): Promise<void> {
    //@ts-ignore
    const result = await this.authRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Can't delete this user with id ${id}`);
    }
  }

  async signIn(
    authCredentialDto: AuthCredentialDto,
  ): Promise<{ accessToken: String }> {
    const { username, password } = authCredentialDto;
    //@ts-ignore
    const user = await this.authRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.hashedPassword))) {
      const payload = { username };
      const accessToken = await this.jwtService.sign(payload);
      return {
        accessToken,
      };
    } else {
      throw new UnauthorizedException('login fail');
    }
  }
}
