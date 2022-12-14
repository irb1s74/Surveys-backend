import {
  Body,
  Controller,
  Header,
  Post,
  Req,
  Res,
  StreamableFile,
  UseGuards,
} from '@nestjs/common';
import { AnswersService } from './answers.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { createReadStream, PathLike } from 'fs';

@Controller('answers')
export class AnswersController {
  constructor(private answersService: AnswersService) {}

  @Post('/create')
  @UseGuards(JwtAuthGuard)
  createQuestion(
    @Body() dto: { questionId: number; title: string; replyId: number },
    @Req()
    request: { user: { id: number } },
  ) {
    return this.answersService.createAnswer({
      questionId: dto.questionId,
      title: dto.title,
      replyId: dto.replyId,
    });
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  getReply(
    @Body() dto: { formId: number },
    @Req()
    request: { user: { id: number } },
  ) {
    return this.answersService.findOreCreateReply({
      formId: dto.formId,
      userId: request.user.id,
    });
  }

  @Post('/excel')
  // @UseGuards(JwtAuthGuard)
  async getExcel(
    @Body() dto: { formId: number },
    @Req()
    request: { user: { id: number } },
  ) {
    const filePath = await this.answersService.createExcelReply({
      formId: dto.formId,
    });
    const file = createReadStream(filePath);
    return new StreamableFile(file);
  }

  @Post('/reply')
  @UseGuards(JwtAuthGuard)
  saveReply(
    @Body()
    dto: { replyId: number; answers: Record<number, string | string[]> },
    @Req()
    request: { user: { id: number } },
  ) {
    return this.answersService.saveReply(dto.replyId, dto.answers);
  }
}
