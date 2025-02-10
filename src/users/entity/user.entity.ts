import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('users')
export class EUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
