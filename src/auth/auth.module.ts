import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { AccountModule } from 'src/account/account.module';
import { AccountService } from 'src/account/account.service';
import { Account } from 'src/account/entities/account.entity';
import { AuthController } from './auth.controller';
import { CountModule } from 'src/count/count.module';
import { CountService } from 'src/count/count.service';
import { Count } from 'src/count/entities/count.entity';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    forwardRef(() => UserModule),
    forwardRef(() => AccountModule),
    ConfigModule,
    TypeOrmModule.forFeature([User, Account, Count]),
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
  ],
  providers: [
    AuthService,
    AccountService,
    JwtStrategy,
    ConfigService,
    UserService,
    CountService,
  ],
  controllers: [AuthController],
  exports: [AuthService, JwtModule, PassportModule],
})
export class AuthModule {}
