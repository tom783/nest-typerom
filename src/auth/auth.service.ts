import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './auth.entity';
import { createUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private authRepository: Repository<UserEntity>,
  ) {}

  async createUser(createUserDto: createUserDto): Promise<UserEntity> {
    const { username, password } = createUserDto;
    const user = this.authRepository.create({
      username,
      password,
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
}
