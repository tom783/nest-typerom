import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserEntity } from 'src/auth/auth.entity';
import { GetUser } from 'src/auth/get-user.decorator';
import { BoardStatus } from './board-status-enum';
import { BoardEntity } from './board.entity';
import { BoardsService } from './boards.service';
import { createBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';

// controller에 인자값은 기본 query path
@Controller('boards')
@UseGuards(AuthGuard('jwt'))
export class BoardsController {
  // private 는 해당 클래스에서만 사용하게끔 설정
  /**
   * boardsService : BoardsService
   * constructor(boardsService : BoardsService) {
   *    this.boardsService = BoardsService
   * }
   * 이것과 같다
   */
  private logger = new Logger('board controller');
  constructor(private boardsService: BoardsService) {}

  @Get('/')
  getAllBoards(@GetUser() user: UserEntity): Promise<BoardEntity[]> {
    this.logger.verbose(`User "${user.username}" trying to get all boards`);
    return this.boardsService.getAllBoards(user);
  }

  @Post()
  createBoard(
    @Body() createBoardDto: createBoardDto,
    @GetUser() user: UserEntity,
  ): Promise<BoardEntity> {
    this.logger.verbose(
      `User "${user.username}" creating a new board. Payload: ${JSON.stringify(
        createBoardDto,
      )}`,
    );
    return this.boardsService.createBoard(createBoardDto, user);
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

  @UseGuards(AuthGuard('jwt'))
  @Post('/test')
  test(@Req() req) {
    console.log('req', req);
  }
}
