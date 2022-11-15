import { IsString, Length } from 'class-validator';

export class UserCreateDto {
  @IsString({ message: 'Must be a string' })
  readonly email: string;

  @IsString({ message: 'Must be a string' })
  @Length(1, 80, {
    message: 'Full name don`t must be less than 1 and more than 20',
  })
  readonly full_name: string;

  @IsString({ message: 'Must be a string' })
  @Length(6, 400, {
    message: 'Password don`t must be less than 6 and more than 400',
  })
  readonly password: string;
}
