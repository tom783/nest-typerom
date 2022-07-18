import { UserEntity } from 'src/auth/auth.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BoardStatus } from './board-status-enum';

@Entity()
export class BoardEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: Number;

  @Column()
  title: String;

  @Column()
  description: String;

  @Column()
  status: BoardStatus;

  @ManyToOne((type) => UserEntity, (user) => user.boards, { eager: false })
  user: UserEntity;
}
