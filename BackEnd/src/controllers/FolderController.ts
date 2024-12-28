import { Request, Response } from 'express';
import { IsNull } from 'typeorm';
import { Student } from '../entities/Student';
import { foldersRepository } from '../repository/folderRepository';
import { Folder } from '../entities/Folder';

interface FolderResponse {
    id: number;
    name: string;
    children: FolderResponse[];
}

interface IPath {
    id: number;
    name: string
}[]

async function getFolderChildren(parentId: Folder, studentId: Student): Promise<FolderResponse[]> {
    const folders = await foldersRepository.find({ where: { parentFolder: parentId, student: studentId } });

    const folderResponses: FolderResponse[] = [];
    for (const folder of folders) {
        const children = await getFolderChildren(folder, studentId);
        folderResponses.push({
            id: folder.id,
            name: folder.name,
            children
        });
    }

    return folderResponses;
}

/**  
*    Função vai pegar todas as pasta dentro de outras pasta em loop até não ter pasta para ser capturada, hhhahahahah
*/
async function getRootFolders(studentId: Student): Promise<FolderResponse[]> {
    const folders = await foldersRepository.find({ where: { parentFolder: IsNull(), student: studentId } });

    const folderResponses: FolderResponse[] = [];
    for (const folder of folders) {
        const children = await getFolderChildren(folder, studentId);
        folderResponses.push({
            id: folder.id,
            name: folder.name,
            children
        });
    }

    return folderResponses;
}

async function getPath(id: number, student: Student): Promise<IPath[]> {
    const folder = await foldersRepository.findOne({ where: { id, student }, relations: ['parentFolder'] });

    let paths: IPath[] = [];

    if (folder) {
        // Adiciona a pasta atual ao caminho
        paths.unshift({ id: folder.id, name: folder.name });

        // Se a pasta pai não for nula, adiciona o caminho da pasta pai
        if (folder.parentFolder !== null) {
            if (!folder.parentFolder) {
                return [{ id: 2403, name: 'complicado isto em' }]
            }
            const parentPaths = await getPath(folder.parentFolder.id, student);
            paths = [...parentPaths, ...paths];
        }
    }

    // Se a pasta atual for a raiz, adiciona "C:\\"
    if (paths.length === 1 && paths[0].id === id) {
        paths.unshift({ id: 0, name: 'C:\\' });
    }

    return paths;
}

export class FolderController {
    async create(req: Request, res: Response): Promise<Response> {
        const { name, id } = req.body;

        try {
            if (!req.studentUser) {
                return res.status(403).json({ error: "Favor Logar" });
            }

            if (!name) {
                return res.status(400).json({ error: "Todos os campos são obrigatórios" });
            }

            if (name.length > 20) {
                return res.status(400).json({ error: "Nome muito grande" });
            }

            let parentFolder: Folder | undefined | null = undefined;
            if (id) {
                parentFolder = await foldersRepository.findOne({ where: { id, student: req.studentUser } });
                if (!parentFolder) {
                    return res.status(400).json({ error: "Pasta anterior à qual você está criando não existe!" });
                }
            }

            const newFolder = foldersRepository.create({
                name,
                student: req.studentUser,
                parentFolder: parentFolder,
            });

            await foldersRepository.save(newFolder);

            return res.status(200).json(newFolder);
        } catch (error) {
            console.error("Erro ao criar pasta:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async getAllFolder(req: Request, res: Response): Promise<Response> {
        const { id } = req.body;

        try {
            if (!req.studentUser) {
                return res.status(403).json({ error: "Favor Logar" });
            }

            if (id === null || id === "" || id === 0) {
                const rootFolders = await getRootFolders(req.studentUser);
                return res.status(200).json(rootFolders);
            } else {
                const folder = await foldersRepository.findOne({ where: { id, student: req.studentUser } });

                if (!folder) {
                    return res.status(404).json({ error: "Pasta não encontrada" });
                }

                const folderResponse: FolderResponse = {
                    id: folder.id,
                    name: folder.name,
                    children: await getFolderChildren(folder, req.studentUser)
                };

                return res.status(200).json(folderResponse);
            }
        } catch (error) {
            console.error("Erro ao obter pastas:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async getFolder(req: Request, res: Response): Promise<Response> {
        const id = req.query.id

        try {
            if (!req.studentUser) {
                return res.status(403).json({ error: "Favor Logar" });
            }

            if (!id || id === null || id === "0") {
                const folder = await foldersRepository.find({ where: { parentFolder: IsNull(), student: req.studentUser }, relations: ['parentFolder', 'childFolders'] });
                if (!folder) {
                    return res.status(404).json({ error: "Pasta não encontrada" });
                }
                const children = folder.map(child => { return { id: child.id, name: child.name } })

                return res.status(200).json({
                    id: 'root',
                    name: 'C:\\',
                    parentFolderId: null,
                    children: children
                })
            } else {
                const folder = await foldersRepository.findOne({ where: { id: Number(id), student: req.studentUser }, relations: ['parentFolder', 'childFolders'] });
                if (!folder) {
                    return res.status(404).json({ error: "Pasta não encontrada" });
                }

                return res.status(200).json({
                    id: folder.id,
                    name: folder.name,
                    parentFolder: folder.parentFolder ? folder.parentFolder.id : 0,
                    children: folder.childFolders
                })
            }
        } catch (error) {
            console.error("Erro ao obter pastas:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const id = Number(req.query.id);

        try {
            if (!req.studentUser) {
                return res.status(401).json({ error: 'Favor logar!' });
            };

            const folders = await foldersRepository.findOne({ where: { id, student: req.studentUser } });
            if (!folders) {
                return res.status(404).json({ error: `Pasta ${id} não encontrada!` });
            };

            await foldersRepository.remove(folders);

            return res.status(201).json({ message: `Pasta ${id} deletada` });
        } catch (error) {
            console.error("Erro ao obter o caminho da pasta:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        };
    }

    async getPathFolder(req: Request, res: Response): Promise<Response> {
        const id = req.query.id;

        try {
            if (!req.studentUser) {
                return res.status(401).json({ error: 'Favor logar!' });
            }

            if (id === '' || id === '0' || !id) {
                return res.status(200).json([{ id: 0, name: 'C:\\' }]);
            }

            const paths = await getPath(Number(id), req.studentUser);

            return res.status(200).json(paths);
        } catch (error) {
            console.error("Erro ao obter o caminho da pasta:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }

    async updateFolder(req: Request, res: Response): Promise<Response> {
        const { id, name } = req.body

        try {
            if (!req.studentUser) {
                return res.status(403).json({ error: "Favor Logar" });
            }

            if (!name) {
                return res.status(404).json({ error: "Favor escrever o novo nome da pasta" });
            }

            const folder = await foldersRepository.findOne({ where: { id, student: req.studentUser } })
            if (!folder) {
                return res.status(404).json({ error: "Pasta não encontrada" });
            }

            const oldName = folder.name
            folder.name = name
            await foldersRepository.save(folder)

            return res.json({ message: `Pasta '${oldName}' renomeada para '${name}' com sucesso` })
        } catch (error) {
            console.error("Erro ao renomear a pasta:", error);
            return res.status(500).json({ error: "Erro interno do servidor" });
        }
    }
}
