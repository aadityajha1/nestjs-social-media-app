import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from './redis.service';
import { Context, GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly redisService: RedisService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      passReqToCallback: true,
    });
  }

  async validate(req: any, payload: any) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req);
    // Check if the token is blacklisted
    const isBlacklisted = await this.redisService.isBlacklisted(token);
    if (isBlacklisted) {
      throw new UnauthorizedException('Token has been invalidated.');
    }
    return { userId: payload.sub, username: payload.username };
  }
}
