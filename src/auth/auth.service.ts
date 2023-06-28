import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../users/user.service';
import { SignInDTO } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async signIn(signInDto: SignInDTO) {
    const { username, password } = signInDto;

    const foundUser = await this.userService.findByUsername(username);
    const valid = await bcrypt.compare(password, foundUser.password);
    
    if (!valid) {
      throw new Error ('User not found');
    }

    const token = await this.jwtService.signAsync({
      sub: foundUser.id,
      username: foundUser.username
    });

    return token;
  }
}
