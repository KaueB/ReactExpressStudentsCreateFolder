import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    OneToOne,
    JoinColumn,
    Unique,
} from "typeorm";
import { User } from "./User";
import { Folder } from "./Folder";
import { Document } from "./Document";

@Entity("students")
@Unique(["id"])
export class Student {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToOne(() => User, (user) => user.student)
    @JoinColumn()
    user: User;

    @OneToMany(() => Folder, (folder) => folder.student)
    folders: Folder[];

    @OneToMany(() => Document, (document) => document.student)
    documents: Document[];
}
