import { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { BadRequestError, UnauthorizedError } from '../helpers/api-erros'
import { userRepository } from '../repository/userRepository'
import { studentsRepository } from '../repository/studentsRepository'
import { teacherRepository } from '../repository/teacherRepository'
import { User } from '../entities/User'

type JwtPayload = {
	id: number
}

async function UserType(user: User) {
	const userStudents = await studentsRepository.findOne({ where: { user: user } })
	const userTeacher = await teacherRepository.findOne({ where: { user: user } })
	if (userStudents) {
		return "student"
	} else if (userTeacher) {
		return "teacher"
	} else {
		throw new BadRequestError('Tipo de usuário inválido!');
	}
}

export const authMiddleware = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const { authorization } = req.headers

	if (!authorization) {
		throw new UnauthorizedError('Não autorizado')
	}

	const token = authorization.split(' ')[1]

	const { id } = jwt.verify(token, process.env.JWT_PASS ?? '') as JwtPayload

	const user = await userRepository.findOneBy({ id })

	if (!user) {
		throw new UnauthorizedError('Não autorizado')
	}

	const typeUser: "student" | "teacher" = await UserType(user)

	if (typeUser === "student") {
		const studentUser = await studentsRepository.findOne({ where: { user: user } });
		req.studentUser = studentUser === null ? undefined : studentUser;
	} else if (typeUser === "teacher") {
		const teacherUser = await teacherRepository.findOne({ where: { user: user } });
		req.teacherUser = teacherUser === null ? undefined : teacherUser;
	}

	const { password: _, ...loggedUser } = user

	req.user = loggedUser

	next()
}