import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Document } from "./Document";
import { Student } from "./Student";

@Entity("folders")
export class Folder {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // Relacionamento recursivo (com a pasta pai)
  @ManyToOne(() => Folder, (folder) => folder.childFolders, {
    nullable: true,
    onDelete: "NO ACTION", // Evitar cascata aqui
  })
  @JoinColumn({ name: "parentFolderId" })
  parentFolder?: Folder;

  // Relacionamento de 1:N com as pastas filhas
  @OneToMany(() => Folder, (folder) => folder.parentFolder)
  childFolders: Folder[];

  // Relacionamento com o estudante
  @ManyToOne(() => Student, (student) => student.folders)
  @JoinColumn({ name: "studentId" })
  student: Student;

  // Relacionamento com os documentos
  @OneToMany(() => Document, (document) => document.folder)
  documents: Document[];
}
