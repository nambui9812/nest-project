import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDTO } from './user.dto';

@Injectable()
export class UserService {
  constructor(
		@InjectRepository(User)
		private readonly userRepository: Repository<User>
	) {}

	async findAll(): Promise<User[]> {
		return this.userRepository.find();
	}

	async findById(id: number): Promise<User> {
		const foundUser = await this.userRepository.findOne({
			where: { id }
		});

		if (!foundUser) throw new Error('User not found');
		return foundUser;
	}

	async findByUsername(username: string): Promise<User> {
		const foundUser = await this.userRepository.findOne({
			where: { username }
		});

		if (!foundUser) throw new Error('User not found');
		return foundUser;
	}

	async create(user: CreateUserDTO): Promise<User> {
		const { username, password } = user;
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = await this.userRepository.save({
			username,
			password: hashedPassword,
		});
		return newUser;
	}

	async deleteById(id: number) {
		const foundUser = await this.findById(id);
		return this.userRepository.remove(foundUser);
	}
}
