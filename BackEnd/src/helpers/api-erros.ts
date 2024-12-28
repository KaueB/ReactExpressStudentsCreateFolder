export class ApiError extends Error {
	public readonly statusCode: number

	constructor(error: string, statusCode: number) {
		super(error)
		this.statusCode = statusCode
	}
}

export class BadRequestError extends ApiError {
	constructor(error: string) {
		super(error, 400)
	}
}

export class NotFoundError extends ApiError {
	constructor(error: string) {
		super(error, 404)
	}
}

export class UnauthorizedError extends ApiError {
	constructor(error: string) {
		super(error, 401)
	}
}