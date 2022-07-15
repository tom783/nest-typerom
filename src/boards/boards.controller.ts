import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BoardStatus } from './board-status-enum';
import { BoardEntity } from './board.entity';
import { BoardsService } from './boards.service';
import { createBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';

// controller에 인자값은 기본 query path
@Controller('boards')
export class BoardsController {
  // private 는 해당 클래스에서만 사용하게끔 설정
  /**
   * boardsService : BoardsService
   * constructor(boardsService : BoardsService) {
   *    this.boardsService = BoardsService
   * }
   * 이것과 같다
   */
  constructor(private boardsService: BoardsService) {}

  @Get('/')
  getAllBoards(): Promise<BoardEntity[]> {
    return this.boardsService.getAllBoards();
  }

  @Post()
  createBoard(@Body() createBoardDto: createBoardDto): Promise<BoardEntity> {
    return this.boardsService.createBoard(createBoardDto);
  }

  @Get('/:id')
  getBoardById(@Param('id') id: Number): Promise<BoardEntity> {
    return this.boardsService.getBoardById(id);
  }

  @Delete('/:id')
  deleteBoard(@Param('id', ParseIntPipe) id: Number): Promise<void> {
    return this.boardsService.deleteBoard(id);
  }

  @Patch('/:id/status')
  updateBoardStatus(
    @Param('id') id: Number,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  ) {
    return this.boardsService.updateBoardStatus(id, status);
  }
}
