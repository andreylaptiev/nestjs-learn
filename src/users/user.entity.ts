import {
  AfterInsert,
  AfterUpdate,
  AfterRemove,
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { Report } from '../reports/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isAdmin: boolean;

  @Column()
  email: string;

  @Column()
  password: string;

  // relation with Report db table
  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];

  @AfterInsert()
  logInsert() {
    console.log('Insert user with id', this.id);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Update user with id', this.id);
  }

  @AfterRemove()
  logRemove() {
    console.log('Remove user with id', this.id);
  }
}
