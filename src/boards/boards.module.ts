import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BoardEntity } from './board.entity';
import { BoardsController } from './boards.controller';
import { BoardsService } from './boards.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([BoardEntity]),
    // AuthModule을 넣어주지 않아도 jwt strategy 적용됨
    // AuthModule
  ],
  controllers: [BoardsController],
  providers: [BoardsService],
})
export class BoardsModule {}
