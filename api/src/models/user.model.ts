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

  @Column
    userName!: string;

  @Column(DataType.TEXT)
    hash!: string;

  @Column(DataType.TEXT)
    salt!: string;

  @CreatedAt
    creationDate?: Date;

  @UpdatedAt
    updatedOn?: Date;

  @DeletedAt
    deletionDate?: Date;

  @HasMany(() => Reminder, { foreignKey: 'idUser', sourceKey: 'id' })
    reminders?: Reminder[];

  @HasMany(() => Lesion)
    lesions?: Lesion[];

  @BelongsToMany(() => User, {
    through: { model: () => PatientRelationship },
    foreignKey: 'doctorId',
    as: 'patients',
    sourceKey: 'id',
  })
    patients?: User[];

  @BelongsToMany(() => User, {
    through: { model: () => PatientRelationship },
    foreignKey: 'patientId',
    as: 'patientOf',
    sourceKey: 'id',
  })
    patientOf?: User[];
}