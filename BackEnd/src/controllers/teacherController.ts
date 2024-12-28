import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { studentsRepository } from "../repository/studentsRepository";
import { userRepository } from "../repository/userRepository";

export class TeacherController {
    async getStudents(req: Request, res: Response): Promise<Response> {
        try {
            const students = await studentsRepository.find();

            if (!students || students.length === 0) {
                return res
                    .status(404)
                    .json({ error: "Nenhum aluno encontrado." });
            }

            return res.status(200).json({ students });
        } catch (error) {
            console.error({ error: error });
            return res.status(500).json({
                error: "Erro ao tentar recuperar os alunos. Tente novamente mais tarde.",
            });
        }
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const id = Number(req.query.id);

        try {
            const student = await studentsRepository.findOne({
                where: { id },
                relations: ["user"],
            });

            if (!student) {
                return res.status(404).json({
                    error: "Aluno não encontrado. Verifique o ID fornecido.",
                });
            }

            const userStudent = await userRepository.findOne({
                where: { id: student.user.id },
            });

            if (!userStudent) {
                await studentsRepository.remove(student);
                return res.status(404).json({
                    error: "Aluno registrado como aluno, mas usuário correspondente não encontrado no sistema.",
                });
            }

            await studentsRepository.remove(student);

            await userRepository.remove(userStudent);

            return res.status(200).json({
                message: `Aluno '${student.name}' (ID: ${id}) foi deletado com sucesso.`,
            });
        } catch (error) {
            console.error({ error: error });
            return res.status(500).json({
                error: "Erro ao tentar deletar o aluno. Tente novamente mais tarde.",
            });
        }
    }

    async resetStudentPassword(req: Request, res: Response): Promise<Response> {
        const id = Number(req.body.id);

        try {
            const studentId = await studentsRepository.findOne({
                where: { id },
                relations: ["user"],
            });

            if (!studentId) {
                return res.status(404).json({
                    error: "Aluno não encontrado. Verifique o ID fornecido.",
                });
            }

            const user = await userRepository.findOne({
                where: { id: studentId.user.id },
            });

            if (!user) {
                return res.status(404).json({ error: "Aluno não encontrado" });
            }

            const student = await studentsRepository.findOne({
                where: { user: user },
            });

            if (!student) {
                return res.status(404).json({ error: "Aluno não encontrado" });
            }

            user.password = await bcrypt.hash("123", 10);
            await userRepository.save(user);

            return res.status(200).json({
                message: `Senha do aluno ${student.name}, foi redefinida como '123'`,
            });
        } catch (error) {
            console.error("Erro ao redefinir senha do aluno:", error);
            return res.status(500).json({ error: `Erro interno do servidor` });
        }
    }
}
