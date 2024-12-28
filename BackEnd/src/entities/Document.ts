import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Folder } from './Folder';
import { Student } from './Student';

@Entity('documents')
@Unique(['id'])
export class Document {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    path: string;

    @ManyToOne(() => Folder, folder => folder.id, { onDelete: 'CASCADE' })
    @JoinColumn()
    folder: Folder;

    @ManyToOne(() => Student, student => student.id)
    @JoinColumn()
    student: Student;
}
