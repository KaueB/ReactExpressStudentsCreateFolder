import { AppDataSource } from '../data-source'
import { Folder } from '../entities/Folder';

export const foldersRepository = AppDataSource.getRepository(Folder);
