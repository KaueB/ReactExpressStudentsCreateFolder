import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, Unique } from 'typeorm';
import { User } from './User';

@Entity('teachers')
@Unique(['id'])
export class Teacher {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    subject: string;

    @OneToOne(() => User, user => user.id)
    @JoinColumn()
    user: User;
}
