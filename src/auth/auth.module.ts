import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [
    PassportModule,
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '60m' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [JwtStrategy, AuthResolver, AuthService],
  exports: [JwtModule],
})
export class AuthModule {}
// import { Module } from '@nestjs/common';
// import { AuthService } from './auth.service';
// import { AuthResolver } from './auth.resolver';

// @Module({
//   providers: [AuthResolver, AuthService],
// })
// export class AuthModule {}
