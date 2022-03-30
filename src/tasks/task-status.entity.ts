import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class TaskStatus {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  value: string;
}
