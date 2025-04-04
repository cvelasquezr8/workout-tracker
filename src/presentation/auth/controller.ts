import { Request, Response } from 'express';
import { RegisterUserDto, AuthRepository, CustomError } from '../../domain/';
import { JwtAdapter } from '../../config';
import { HttpResponse } from '../../common/responses/http-response';

export class AuthController {
	constructor(private readonly authRepository: AuthRepository) {}

	private handleError = (error: unknown, res: Response) => {
		if (error instanceof CustomError) {
			return HttpResponse.error({
				res,
				message: error.message,
				statusCode: error.statusCode,
			});
		}

		console.log({ error });
		// Handle other types of errors (e.g., database errors, validation errors)
		return HttpResponse.error({
			res,
			message: 'Internal Server Error',
			statusCode: 500,
		});
	};

	registerUser = async (req: Request, res: Response): Promise<any> => {
		const startTime = Date.now();
		const [error, userRegisterDto] = RegisterUserDto.create(req.body);
		if (error) {
			return HttpResponse.error({
				res,
				message: error,
				statusCode: 400,
				startTime,
			});
		}

		this.authRepository
			.register(userRegisterDto!)
			.then(async (user) => {
				const token = await JwtAdapter.generateToken({ id: user.id });
				return HttpResponse.success({
					res,
					statusCode: 201,
					message: `User registered successfully`,
					data: { user, token },
					startTime,
				});
			})
			.catch((error) => this.handleError(error, res));
	};

	loginUser = async (req: Request, res: Response) => {
		res.json('login');
	};

	validateEmail = async (req: Request, res: Response) => {
		res.json('validateEmail');
	};
}
