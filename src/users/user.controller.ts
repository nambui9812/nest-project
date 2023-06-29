import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO } from './user.dto';
import { Public } from '../configs/auth';
import { GetResponse } from '../configs/response';

@Controller('users')
export class UserController {
	constructor(private readonly userService: UserService) {}

	// TODO: For current dev process only, need to add authority check after add admin
	@Public()
	@Get()
	async getAll() {
		const users = await this.userService.findAll();
		const removedPasswordUsers = users.map((user) => {
			const { password, ...rest } = user;
			return rest;
		});
		return GetResponse({
			message: 'Get all users successfully',
			data: removedPasswordUsers
		});
	}

	// TODO: For current dev process only, need to add authority check after add admin
	@Public()
	@Get(':id')
	async getById(@Param('id') id: number) {
		const foundUser = await this.userService.findById(id);
		const { password, ...rest } = foundUser;
		return GetResponse({
			message: 'Get user successfully',
			data: rest
		});
	}

	@Public()
	@Post()
	async signUp(@Body() createUserDTO: CreateUserDTO) {
		const newUser = await this.userService.create(createUserDTO);
		const { password, ...rest } = newUser;
		return GetResponse({
			message: 'Get user successfully',
			data: rest
		});
	}

	// TODO: For current dev process only, need to add authority check after add admin
	@Public()
	@Delete(':id')
	async deleteById(@Param('id') id: number) {
		await this.userService.deleteById(id);
		return GetResponse({
			message: 'User deleted'
		});
	}
}
