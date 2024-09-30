import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from './redis.service';
@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private redisService: RedisService,
  ) {}
  create(createAuthInput: CreateAuthInput) {
    return 'This action adds a new auth';
  }

  async login(loginDto: LoginDto): Promise<{ access_token: string }> {
    const { email, password } = loginDto;
    const user = await this.userService.findOneByEmailOrUsername(email);

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid email or password');
    }

    const payload = { username: user.email, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(token: string) {
    const decoded = this.jwtService.decode(token) as { exp: number };
    console.log('Decoded token:', decoded, token);
    if (decoded && decoded.exp) {
      console.log('Is decoded adn exp');
      const expiresIn = decoded.exp - Math.floor(Date.now() / 1000);
      // Add the token to the Redis blacklist with the time until it expires
      await this.redisService.blacklistToken(token, expiresIn);
    }
    return { access_token: token };
  }
}
