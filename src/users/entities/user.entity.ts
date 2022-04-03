import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Task } from '../../tasks/task.entity';
import Role from '../../auth/user-role.enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
  })
  role: Role;

  // eager == true means that whenever we fetch the user from the db, it will also fetch the tasks
  @OneToMany((_type) => Task, (task) => task.user, { eager: true })
  tasks: Task[];
}
