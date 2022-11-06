import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../users/user.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: false })
  isApproved: boolean;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column()
  price: number;

  @Column()
  longitude: number;

  @Column()
  latitude: number;

  @Column()
  milage: number;

  // relation with User db table
  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
