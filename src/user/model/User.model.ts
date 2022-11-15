import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Forms } from '../../forms/model/Forms.model';

interface UserCreationAttrs {
  email: string;
  full_name: string;
  nickname: string;
}

@Table({ tableName: 'user', updatedAt: false })
export class User extends Model<User, UserCreationAttrs> {
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @Column({ type: DataType.STRING, allowNull: true })
  full_name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @Column({ type: DataType.STRING, allowNull: true })
  avatar: string;

  @HasMany(() => Forms)
  forms: Forms[];
}
