import jwt from 'jsonwebtoken';
import { envs } from './envs';

export class JwtAdapter {
	static async generateToken(
		payload: Object,
		duration: string = '2h',
	): Promise<string | null> {
		return new Promise((resolve) => {
			jwt.sign(
				payload,
				envs.JWT_SECRET,
				{ expiresIn: duration as jwt.SignOptions['expiresIn'] },
				(err, token) => {
					if (err) {
						resolve(null);
					} else {
						resolve(token!);
					}
				},
			);
		});
	}
}
