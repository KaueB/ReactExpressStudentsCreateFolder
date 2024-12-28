import { Column, Entity, OneToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Student } from './Student';
import { Teacher } from './Teacher';

@Entity('users')
@Unique(['id'])
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    password: string;

    @OneToOne(() => Student, student => student.user)
    student: Student;

    @OneToOne(() => Teacher, teacher => teacher.user)
    teacher: Teacher;
}
