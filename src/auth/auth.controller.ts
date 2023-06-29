import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { SignInDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { Public } from '../configs/auth';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async signIn(@Body() signInDto: SignInDTO) {
    const token = await this.authService.signIn(signInDto);
    return {
      token
    };
  }

  @Get('user')
  async getUser(@Req() req: Request) {
    return req['user'];
  }
}
