import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../tasks/task.entity';
@Entity()
export class Status {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  value: string;

  @ManyToOne((_type) => Task, (task) => task, { eager: false })
  @Exclude({ toPlainOnly: true }) // means excluding this property when converting the object to plain text (JSON counts as plain text)
  task: Task;
}
