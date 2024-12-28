import { Router } from 'express'
import { UserController } from './controllers/UserController'
import { FolderController } from './controllers/FolderController'

import { authMiddleware } from './middlewares/authMiddleware'
import { DocumentsController } from './controllers/documentsController'

// Create Multer
import { uploadSingleFile } from './middlewares/handleMulterErrors' // upload.single('file')
import { TeacherController } from './controllers/teacherController'

const routes = Router()

// Creação do usuario tanto na tabela professor ou aluno, quanto na tabela user
routes.post('/user', new UserController().create);
routes.post('/login', new UserController().login); // aqui pega um token de login

routes.use(authMiddleware);
routes.get('/profile', new UserController().getProfile);

// User
routes.get("/user", new UserController().getUsers);
routes.delete('/user/:id', new UserController().deleteUser); // aqui esta usando o id do User.
routes.put('/user', new UserController().updateUser); // aqui é para editar o proprio User;

// Teacher 
routes.get("/teachers/students", new TeacherController().getStudents)
routes.delete("/teachers/students", new TeacherController().delete)
routes.patch('/teachers/students', new TeacherController().resetStudentPassword) // aqui é para redefinir a senha de um aluno 

// Folder   
routes.post('/students/folder', new FolderController().create); // Criar pasta
routes.get('/students/folder', new FolderController().getFolder);
routes.delete('/students/folder', new FolderController().delete); // Vai pegar somente a pasta onde na qual vc está
routes.get('/students/parentfolder', new FolderController().getPathFolder);
routes.put('/students/folder', new FolderController().updateFolder); // Vai mudar o nome da pasta
routes.get('/students/allfolder', new FolderController().getAllFolder); // Pegar todas as pasta

// documents
routes.post('/students/documents', uploadSingleFile, new DocumentsController().create); // Criação de documentos dentro de pasta ou na raiz
routes.get('/students/documents', new DocumentsController().getDocuments); // pega os documentos por id da pasta
routes.get('/students/downloads', new DocumentsController().downloads)  // downloads dos documentos
routes.get('/students/namedocument', new DocumentsController().nameDocuments)
routes.delete('/students/documents', new DocumentsController().delete)
routes.put('/students/documents', new DocumentsController().updateName); // muda o nome do documento

export default routes;