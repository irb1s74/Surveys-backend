import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Questions } from './model/Questions.model';
import { FormsService } from '../forms/forms.service';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectModel(Questions) private questionsRepo: typeof Questions,
    private formsService: FormsService,
  ) {}

  async getQuestionById(questionId: number) {
    try {
      return await this.questionsRepo.findByPk(questionId);
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  async questionsCreate(
    formId: number,
    title: string,
    type: string,
    userId: number,
  ) {
    try {
      const form = await this.formsService.getFormById(formId);
      if (form.userId === userId) {
        return await this.questionsRepo.create({ formId, type });
      }
      return new HttpException('Неправильный запрос', HttpStatus.BAD_REQUEST);
    } catch (e) {
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }

  async updateQuestions({
    type,
    title,
    required,
    formId,
  }: {
    formId: number;
    title: string;
    type: string;
    required: boolean;
  }) {
    try {
      const question = await this.questionsRepo.findByPk(formId);
      question.title = title;
      question.type = type;
      question.required = required;
      await question.save();
      return question;
    } catch (e) {
      throw new HttpException('Неправильный запрос', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteQuestions(userId: number, questionId: number) {
    try {
      const question = await this.questionsRepo.findByPk(questionId);
      const form = await this.formsService.getFormById(question.formId);
      if (form.userId === userId) {
        await question.destroy();
        return new HttpException('Вопрос удален', HttpStatus.OK);
      }
      return new HttpException('Нету доступа', HttpStatus.FORBIDDEN);
    } catch (e) {
      throw new HttpException('Неправильный запрос', HttpStatus.BAD_REQUEST);
    }
  }
}