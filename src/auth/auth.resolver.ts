import { Resolver, Query, Mutation, Args, Int, Context } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { Auth } from './entities/auth.entity';
import { CreateAuthInput } from './dto/create-auth.input';
import { UpdateAuthInput } from './dto/update-auth.input';
import { LoginDto } from './dto/login.dto';
import { ExtractJwt } from 'passport-jwt';
import { LogoutResponse } from './dto/logoutresponse.dto';
import { Request, UseGuards } from '@nestjs/common';
import { GoogleOAuthGuard } from './google-oauth.guard';

@Resolver(() => Auth)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => LogoutResponse, { nullable: true })
  logout(@Context() context: any) {
    const token = context.req.headers.authorization?.split(' ')[1];
    // const token = ExtractJwt.fromAuthHeaderAsBearerToken()(context.req);

    return this.authService.logout(token);
  }

  @Mutation(() => Auth)
  login(@Args('loginDto') loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(GoogleOAuthGuard)
  @Mutation(() => Auth)
  googleAuth(@Request() req) {}

  @UseGuards(GoogleOAuthGuard)
  @Mutation(() => Auth)
  googleRedirect(@Request() req) {
    return this.authService.googleLogin(req);
  }
}
