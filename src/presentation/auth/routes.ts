import { Router } from 'express';
import { AuthController } from './controller';

export class AuthRoutes {
	static get routes(): Router {
		const router = Router();

		const controller = new AuthController();
		//! TODO: implement business logic
		router.post('/login', controller.loginUser);
		router.post('/register', controller.registerUser);
		router.post('/validate-email/:token', controller.validateEmail);
		return router;
	}
}
