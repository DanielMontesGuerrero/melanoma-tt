import {
  Table,
  Column,
  Model,
  HasMany,
  AutoIncrement,
  PrimaryKey,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  DataType,
  BelongsToMany,
  Unique,
} from 'sequelize-typescript';
import Lesion from './lesion.model';
import Reminder from './reminder.model';
import PatientRelationship from './patientRelationship.model';

@Table
export default class User extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column
    id!: number;

  @Column
    name!: string;

  @Column
    lastName!: string;

  @Unique
  @Column
    userName!: string;

  @Column(DataType.TEXT)
    hash!: string;

  @Column(DataType.TEXT)
    salt!: string;

  @Column
    isDoctor!: boolean;

  @CreatedAt
    creationDate?: Date;

  @UpdatedAt
    updatedOn?: Date;

  @DeletedAt
    deletionDate?: Date;

  @HasMany(() => Reminder, { foreignKey: 'idUser', sourceKey: 'id' })
    reminders?: Reminder[];

  @HasMany(() => Lesion, { foreignKey: 'idUser', sourceKey: 'id' })
    lesions?: Lesion[];

  @BelongsToMany(() => Lesion, {
    through: { model: () => PatientRelationship },
    foreignKey: 'doctorId',
    sourceKey: 'id',
    as: 'sharedLesions',
  })
    sharedLesions?: Lesion[];
}
