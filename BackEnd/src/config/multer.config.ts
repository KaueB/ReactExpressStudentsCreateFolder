import multer from 'multer';
import path from 'path';
import crypto from 'crypto';
import { Request, Response } from 'express';

// Configuração do Multer para armazenamento de arquivos
const storage = multer.diskStorage({
    destination: path.resolve(__dirname, '..', '..', 'uploads'),
    filename(
        _request: Request,
        file: Express.Multer.File,
        callback: (error: Error | null, filename: string) => void
    ) {
        const hash = crypto.randomBytes(6).toString('hex');
        const fileName = `${hash}-${file.originalname}`;
        callback(null, fileName);
    }
});

const fileFilter = (
    _request: Request,
    file: Express.Multer.File,
    callback: multer.FileFilterCallback
) => {
    const allowedTypes = [
        'image/jpg',
        'image/jpeg',
        'image/png',
    ];

    if (allowedTypes.includes(file.mimetype)) {
        callback(null, true);
    } else {
        callback(new Error('Tipo de arquivo não suportado'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 2.5 // 2,5 MB em bytes
    }
});

export default upload;
