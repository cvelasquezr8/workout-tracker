import { BcryptAdapter } from '../../config/';
import { prisma } from '../../data/postgres';
import {
	AuthDatasource,
	RegisterUserDto,
	UserEntity,
	CustomError,
} from '../../domain/';

import { UserMapper } from '../mappers/user.mapper';

type HashFunction = (password: string) => string;
type CompareFunction = (password: string, hashed: string) => boolean;

export class AuthDataSourceImpl implements AuthDatasource {
	constructor(
		private readonly hashFunction: HashFunction = BcryptAdapter.hash,
		private readonly compareFunction: CompareFunction = BcryptAdapter.compare,
	) {}

	async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
		const { email, firstName, lastName, password } = registerUserDto;
		try {
			//1. Check if the user already exists
			const exists = await prisma.user.findUnique({ where: { email } });
			if (exists) throw CustomError.badRequest('User already exists');

			//2. Hash the password
			const hashedPassword = this.hashFunction(password);

			//3. Create a new user in the database
			const user = await prisma.user.create({
				data: {
					firstName,
					lastName,
					email,
					password: hashedPassword,
				},
			});

			//4. Return the created user
			return UserMapper.userEntityFromObject(user);
		} catch (error) {
			if (error instanceof CustomError) {
				throw error;
			}

			throw CustomError.internalServerError('Internal Server Error');
		}
	}
}
