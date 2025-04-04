import { Request, Response } from 'express';

export class AuthController {
	constructor() {}

	registerUser = async (req: Request, res: Response) => {
		res.json('register');
	};

	loginUser = async (req: Request, res: Response) => {
		res.json('login');
	};

	validateEmail = async (req: Request, res: Response) => {
		res.json('validateEmail');
	};
}
