import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Student } from '../entities/Student';
import { Teacher } from '../entities/Teacher';
import { User } from '../entities/User';
import { BadRequestError } from '../helpers/api-erros';
import { studentsRepository } from '../repository/studentsRepository';
import { teacherRepository } from '../repository/teacherRepository';
import { userRepository } from '../repository/userRepository';

async function UserType(user: User): Promise<"student" | "teacher"> {
	const userStudents = await studentsRepository.findOne({ where: { user: user } });
	const userTeacher = await teacherRepository.findOne({ where: { user: user } });
	if (userStudents) {
		return "student";
	} else if (userTeacher) {
		return "teacher";
	} else {
		throw new BadRequestError('Tipo de usuário inválido!');
	}
}

export class UserController {
	async create(req: Request, res: Response): Promise<Response> {
		const { name, email, password, occupation, subject } = req.body;

		const userExists = await userRepository.findOne({ where: { email } });
		if (userExists) {
			throw new BadRequestError('E-mail já existe');
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = userRepository.create({
			email,
			password: hashedPassword,
		});
		await userRepository.save(newUser);

		const userCreated = await userRepository.findOne({ where: { email } });

		if (occupation === 'student') {
			if (userCreated) {
				const newStudent = studentsRepository.create({
					name,
					user: userCreated
				});
				await studentsRepository.save(newStudent);
			}

			const { password: _, ...student } = newUser;

			return res.status(201).json(student);
		} else if (occupation === 'teacher') {
			if (userCreated) {
				const newTeacher = teacherRepository.create({
					name,
					subject,
					user: userCreated
				});
				await teacherRepository.save(newTeacher);
			}

			const { password: _, ...teacher } = newUser;

			return res.status(201).json(teacher);
		} else {
			throw new BadRequestError('Ocupação não definida!');
		}
	}

	async login(req: Request, res: Response): Promise<Response> {
		const { email, password } = req.body;

		if (!email) throw new BadRequestError('O login é obrigatório.');
		if (!password) throw new BadRequestError('A senha é obrigatória.');

		const user = await userRepository.findOne({ where: { email } });

		if (!user) {
			throw new BadRequestError('Email ou senha incorreto!');
		}

		const verifyPass: boolean = await bcrypt.compare(password, user.password);
		if (!verifyPass) {
			throw new BadRequestError('Email ou senha incorreto!');
		}

		const token = jwt.sign({ id: user.id }, process.env.JWT_PASS ?? '', {
			expiresIn: '8h',
		});

		const { password: _, ...userLogin } = user;

		return res.status(200).json({
			user: userLogin,
			token: token,
		});
	}

	async getProfile(req: Request, res: Response): Promise<Response> {
		return res.status(200).json({
			user: req.user,
			student: req.studentUser,
			teacher: req.teacherUser
		});
	}

	async getUsers(req: Request, res: Response): Promise<Response> {
		const { occupation } = req.body;

		try {
			if (occupation !== 'student' && occupation !== 'teacher') {
				return res.status(400).json({ error: "Ocupação inválida" });
			}

			const users: Student[] | Teacher[] = await (occupation === 'student' ? studentsRepository.find() : teacherRepository.find());

			const usersWithoutPassword = users.map((user: any) => {
				const { password, ...userWithoutPassword } = user;
				return userWithoutPassword;
			});

			return res.status(200).json(usersWithoutPassword);
		} catch (error) {
			console.error("Erro ao obter usuários:", error);
			return res.status(500).json({ error: "Erro interno do servidor" });
		}
	}

	async updateUser(req: Request, res: Response): Promise<Response> {
		const { name, email, password } = req.body;

		try {
			if (!email && !name && !password) {
				return res.status(400).json({
					error: "Pelo menos um campo (nome ou senha) deve ser fornecido.",
				});
			}

			const userSelect = await userRepository.findOne({ where: { id: req.user.id } });
			if (!userSelect) {
				return res.status(404).json({ error: "Usuário não encontrado" });
			}

			const userType: "student" | "teacher" = await UserType(userSelect);

			const userStudentId = await studentsRepository.findOne({ where: { user: userSelect } });
			const userTeacherId = await teacherRepository.findOne({ where: { user: userSelect } });
			if (userType === "student") {
				if (userStudentId) {
					if (name) userStudentId.name = name;
					if (email) userSelect.email = email;
					if (password) userSelect.password = await bcrypt.hash(password, 10);

					await studentsRepository.save(userStudentId);
				} else {
					return res.status(404).json({ error: "Aluno não encontrado" });
				}
			} else if (userType === "teacher") {
				if (userTeacherId) {
					if (name) userTeacherId.name = name;
					if (email) userSelect.email = email;
					if (password) userSelect.password = await bcrypt.hash(password, 10);

					await teacherRepository.save(userTeacherId);
				} else {
					return res.status(404).json({ error: "Professor não encontrado" });
				}
			}

			const { password: _, ...userSelectPass } = userSelect;
			await userRepository.save(userSelect);

			return res.status(200).json({
				user: userSelectPass,
				student: userType === "student" ? userStudentId : undefined,
				teacher: userType === "teacher" ? userTeacherId : undefined
			});
		} catch (error) {
			console.error("Erro ao alterar usuário:", error);
			return res.status(500).json({ error: "Erro interno do servidor" });
		}
	}

	async deleteUser(req: Request, res: Response): Promise<Response> {
		const { id } = req.params;

		try {
			if (req.teacherUser) {
				return res.status(401).json({ error: "Não autorizado" });
			}

			const user = await userRepository.findOne({ where: { id: Number(id) } });
			if (!user) {
				return res.status(404).json({ error: "Usuário não encontrado" });
			}

			const userType: "student" | "teacher" = await UserType(user);

			if (userType === "student") {
				const studentRecords = await studentsRepository.find({ where: { user: user } });
				await studentsRepository.remove(studentRecords);
			} else if (userType === "teacher") {
				const teacherRecords = await teacherRepository.find({ where: { user: user } });
				await teacherRepository.remove(teacherRecords);
			}

			await userRepository.remove(user);

			const { password, ...userWithoutPassword } = user;
			return res.status(200).json({ message: "Usuário excluído com sucesso", deletedUser: userWithoutPassword });

		} catch (error) {
			console.error("Erro ao deletar usuário:", error);
			return res.status(500).json({ error: "Erro interno do servidor" });
		}
	}
}
