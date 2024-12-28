import { NextFunction, Request, Response } from 'express';
import multer from 'multer';
import upload from '../config/multer.config';

export const uploadSingleFile = (req: Request, res: Response, next: NextFunction) => {
    upload.single('file')(req, res, (err: any) => {
        if (err) {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        error: "O arquivo é muito grande. Apenas arquivos com menos de 500KB são permitidos."
                    });
                } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                    return res.status(400).json({
                        error: "Este tipo de arquivo não é compatível."
                    });
                }
            } else {
                return res.status(400).json({
                    error: "Erro desconhecido!"
                });
            }
        }
        next();
    });
}
