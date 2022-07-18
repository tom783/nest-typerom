import { BoardEntity } from 'src/boards/board.entity';
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['username'])
export class UserEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: Number;

  @Column()
  username: String;

  @Column()
  password: String;

  @Column()
  hashedPassword: String;

  @OneToMany((type) => BoardEntity, (board) => board.user, { eager: true })
  boards: BoardEntity[];
}
