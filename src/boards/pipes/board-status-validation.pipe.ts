import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { BoardStatus } from '../board-status-enum';

export class BoardStatusValidationPipe implements PipeTransform {
  readonly StatusOptions = [BoardStatus.PUBLIC, BoardStatus.PRIVATE];

  private isStatusValid(value) {
    const index = this.StatusOptions.indexOf(value);
    return -1 !== index;
  }

  transform(value: any, metadata: ArgumentMetadata) {
    value = value?.toUpperCase();
    if (!this.isStatusValid(value)) {
      throw new BadRequestException(`${value} isn't in the stauts options`);
    }
    return value;
  }
}
