import { InjectModel } from '@nestjs/sequelize';
import { Forms } from './model/Forms.model';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Questions } from '../questions/model/Questions.model';
import { Variant } from '../variant/model/Variant.model';
import { Reply } from '../answers/model/Reply.model';
import { Answers } from '../answers/model/Answers.model';
import sequelize, { Op } from 'sequelize';
import { User } from '../user/model/User.model';
import { Subdivision } from '../subdivision/model/Subdivision.model';

export class FormsService {
  constructor(@InjectModel(Forms) private formsRepo: typeof Forms) {}

  async getForms(userId: number) {
    return await this.formsRepo.findAll({});
  }

  async getFormById(formId: number) {
    try {
      return await this.formsRepo.findByPk(formId, {
        include: [
          {
            model: Questions,
            required: false,
            include: [Variant],
          },
          {
            model: Reply,
            required: false,
            where: {
              draft: false,
            },
            include: [
              {
                model: Answers,
              },
              {
                model: User,
                attributes: { exclude: ['password'] },
                include: [{ model: Subdivision, attributes: ['name'] }],
              },
            ],
          },
        ],
        order: [
          ['questions', 'id'],
          ['questions', 'variants', 'id'],
        ],
      });
    } catch (e) {
      console.log(e);
      throw new HttpException('Неправильный запрос', HttpStatus.BAD_REQUEST);
    }
  }

  async formsCreate(userId: number, title: string) {
    return await this.formsRepo.create({ userId, title });
  }

  async updateForm(formId: number, title: string) {
    try {
      const form = await this.formsRepo.findByPk(formId);
      form.title = title;
      await form.save();
      return form;
    } catch (e) {
      throw new HttpException('Неправильный запрос', HttpStatus.BAD_REQUEST);
    }
  }

  async deleteForm(userId: number, formId: number) {
    try {
      const form = await this.formsRepo.findOne({
        where: { [Op.and]: [{ id: formId }, { userId: userId }] },
        include: [{ model: Reply, include: [Answers] }],
      });
      if (form) {
        await form.destroy();
        return new HttpException('Форма удалена', HttpStatus.OK);
      }
      return new HttpException('Форма не найдена', HttpStatus.BAD_REQUEST);
    } catch (e) {
      console.log(e);
      throw new HttpException(e, HttpStatus.BAD_REQUEST);
    }
  }
}
