import { Request, Response } from 'express';
import { foldersRepository } from '../repository/folderRepository';
import { documentsRepository } from '../repository/documentsRepository';
import { Document } from '../entities/Document';
import { IsNull } from 'typeorm';
import fileconfig from '../config/fileConfig';

export class DocumentsController {
    async create(req: Request, res: Response): Promise<Response> {
        const file = req.file
        const { id } = req.body;

        try {
            if (!req.studentUser) {
                return res.status(401).json({ error: "Apenas alunos têm permissão para criar documentos." });
            }

            if (!file) {
                return res.status(400).json({ error: "Falto anexar algum arquivo" })
            }

            if (id && id != 0) {
                const folder = await foldersRepository.findOne({ where: { id, student: req.studentUser } })
                if (!folder) {
                    return res.status(404).json({ error: "Pasta não encontrada!" });
                }
            }

            const { filename, originalname } = file;

            const newDocument = documentsRepository.create({
                name: originalname,
                path: filename,
                student: req.studentUser,
                folder: id && id != 0 ? id : null
            })
            await documentsRepository.save(newDocument)

            return res.status(201).json(newDocument);
        } catch (error) {
            console.error({ "error": error })
            return res.status(500).json({ error: "Erro ao criar documento." });
        }
    }

    async getDocuments(req: Request, res: Response): Promise<Response> {
        const id = Number(req.query.id);

        try {
            if (!req.studentUser) {
                return res.status(401).json({ error: "Favor logar!" });
            }

            if (id === null || id === 0) {
                const documents = await documentsRepository.find({ where: { folder: IsNull(), student: req.studentUser } })
                return res.status(200).json(documents);
            }

            if (typeof id === 'number' && !isNaN(id)) {
                const folder = await foldersRepository.findOne({ where: { id, student: req.studentUser } })
                if (!folder) {
                    return res.status(404).json({ error: "Pasta não encontrada." });
                }

                const document = await documentsRepository.find({ where: { folder: folder, student: req.studentUser } })
                return res.status(200).json(document)
            } else {
                return res.status(400).json({ error: "O id da pasta enviado está como string." });
            }
        } catch (error) {
            /* console.error({ "error": error }) */
            return res.status(500).json({ error: "Erro ao buscar documentos." });
        }
    }

    async updateName(req: Request, res: Response): Promise<Response> {
        const { id, name } = req.body;

        try {
            if (!req.studentUser) {
                return res.status(401).json({ error: "Favor logar!" });
            }

            if (!name) {
                return res.status(400).json({ error: "Favor escrever o novo nome do documento." });
            }

            let document: Document | null
            if (id === 0 || "0" || null || undefined) {
                document = await documentsRepository.findOne({ where: { id: IsNull(), student: req.studentUser } })
                console.log('id null')
            } else {
                document = await documentsRepository.findOne({ where: { id, student: req.studentUser } })
                console.log('id tem algo')
            }
            console.log(document)

            if (document) {
                const oldName = document.name
                document.name = name
                documentsRepository.save(document)

                return res.status(200).json({ message: `O documento '${oldName}' foi renomeado para '${name}' com sucesso.` });
            } else {
                return res.status(404).json({ error: "Documento não encontrado." });
            }
        } catch (error) {
            console.error({ "error": error })
            return res.status(500).json({ error: "Erro ao atualizar o nome do documento." });
        }
    }

    async downloads(req: Request, res: Response): Promise<Response | void> {
        const id = Number(req.query.id);

        try {
            if (!req.studentUser) {
                return res.status(401).json({ error: "Usuário não autenticado. Por favor, faça login." });
            }
            const student = req.studentUser;

            const document = await documentsRepository.findOne({ where: { id, student } });
            if (!document) {
                return res.status(404).json({ error: "Documento não encontrado." });
            }

            const directoryPath = fileconfig.filelocation; // './uploads'
            const filePath = `${directoryPath}/${document.path}`;
            const safeFileName = document.name.replace(/[<>:"/\\|?*]+/g, '_');

            res.download(filePath, safeFileName, (err) => {
                if (err) {
                    return res.status(500).send({
                        message: `Erro ao baixar o documento: ${err.message}`,
                    });
                }
            });
        } catch (error) {
            console.error({ error: error });
            return res.status(500).json({ error: "Erro interno ao processar o download do documento." });
        }
    }

    async nameDocuments(req: Request, res: Response): Promise<Response> {
        const id = Number(req.query.id);

        try {
            if (!req.studentUser) {
                return res.status(401).json({ error: "Usuário não autenticado. Por favor, faça login." });
            }

            const student = req.studentUser;

            const document = await documentsRepository.findOne({ where: { id, student } });
            if (!document) {
                return res.status(404).json({ error: "Documento não encontrado." });
            }

            return res.status(200).json({ name: document.name })
        } catch (error) {
            console.error({ error: error });
            return res.status(500).json({ error: "Erro para conseguir o nome do documento." });
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const id = Number(req.query.id);

        try {
            if (!req.studentUser) {
                return res.status(401).json({ error: "Usuário não autenticado. Por favor, faça login." });
            }

            const document = await documentsRepository.findOne({ where: { id, student: req.studentUser } })
            if (!document) {
                return res.status(401).json({ error: "Documento não encontrado" })
            }

            await documentsRepository.remove(document)

            return res.status(200).json({ message: `Documento ${document.name} deletado` })
        } catch (error) {
            console.error({ error: error });
            return res.status(500).json({ error: "Erro interno ao deletar o documento." });
        }
    }
}