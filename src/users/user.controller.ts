import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './user.dto';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	async getAll() {
		const users = await this.userService.findAll();
		return users;
	}

	@Get('/:id')
	async getById(@Param('id') id: number) {
		const foundUser = await this.userService.findById(id);
		return foundUser;
	}

	@Post()
	async signUp(@Body() createUserDTO: CreateUserDTO) {
		const newUser = await this.userService.create(createUserDTO);
		return newUser;
	}

	@Delete('/:id')
	async deleteById(@Param('id') id: number) {
		await this.userService.deleteById(id);
		return {
			message: 'User deleted'
		};
	}
}
