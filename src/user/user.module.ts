import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Account } from 'src/account/entities/account.entity';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from 'src/auth/auth.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User, Account]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get('JWT_EXPIRATION'),
        },
      }),
    }),
    forwardRef(() => AuthModule),
  ],
  providers: [UserService, AuthService, ConfigService, JwtStrategy],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
