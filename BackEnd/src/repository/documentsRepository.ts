import { AppDataSource } from '../data-source';
import { Document } from '../entities/Document';

export const documentsRepository = AppDataSource.getRepository(Document);
