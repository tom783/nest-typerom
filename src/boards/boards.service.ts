import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardStatus } from './board-status-enum';
import { v1 as uuid } from 'uuid';
import { createBoardDto } from './dto/create-board.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardEntity } from './board.entity';
import { Repository } from 'typeorm';

// @Injectable 데코레이터를 사용해서 어디에서든 해당 service를 접근가능하도록 설정
// service는 데이터의 유효성을 체크하거나 db를 컨트롤하는 기능을 구현
@Injectable()
export class BoardsService {
  constructor(
    @InjectRepository(BoardEntity)
    private boardRepository: Repository<BoardEntity>,
  ) {}

  async getAllBoards(): Promise<BoardEntity[]> {
    return await this.boardRepository.find();
  }

  async getBoardById(id: Number): Promise<BoardEntity> {
    //@ts-ignore
    const board = await this.boardRepository.findOne({ where: { id } });

    if (!board) {
      throw new NotFoundException(`Not found this board ${id}`);
    }
    return board;
  }

  async createBoard(createBoardDto: createBoardDto): Promise<BoardEntity> {
    const { title, description } = createBoardDto;

    const board = this.boardRepository.create({
      title,
      description,
      status: BoardStatus.PUBLIC,
    });
    await this.boardRepository.save(board);
    return board;
  }

  async deleteBoard(id: Number): Promise<void> {
    //@ts-ignore
    const result = await this.boardRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException("Can't find board width id");
    }
  }

  async updateBoardStatus(
    id: Number,
    status: BoardStatus,
  ): Promise<BoardEntity> {
    const board = await this.getBoardById(id);
    board.status = status;
    await this.boardRepository.save(board);
    return board;
  }

  // private boards: BoardInterface[] = []; // 임시 db역할

  // getAllBoards(): BoardInterface[] {
  //   return this.boards;
  // }

  // createBoard(createBoardDto: createBoardDto) {
  //   const { title, description } = createBoardDto;
  //   const board: BoardInterface = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: BoardStatus.PUBLIC,
  //   };

  //   this.boards.push(board);
  //   return board;
  // }

  // getBoardById(id: String): BoardInterface {
  //   const board = this.boards.find((board) => board.id === id);

  //   if (!board) {
  //     throw new NotFoundException('Not found this board');
  //   }
  //   return board;
  // }

  // deleteBoard(id: String): void {
  //   this.boards = this.boards.filter((board) => board.id !== id);
  // }

  // updateBoardStatus(id: String, status: BoardStatus): BoardInterface {
  //   const board = this.getBoardById(id);
  //   board.status = status;
  //   return board;
  // }
}
