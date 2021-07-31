import {
  forwardRef,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from 'src/user/entities/user.entity';
import { IUser } from 'src/user/types';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { createHmac } from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  constructor(
    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUserByEmail(login: string): Promise<User> {
    const user = await this.userService.getUserByLogin(login);

    if (!user) {
      throw new UnauthorizedException('Wrong email or password.');
    }

    return user;
  }

  async encryptPassword(password: string): Promise<string> {
    return createHmac('sha256', password).digest('hex');
  }

  async generateToken(user: IUser): Promise<any> {
    this.logger.log('Token generated');

    return {
      expiresIn: this.configService.get('JWT_EXPIRATION'),
      accessToken: this.jwtService.sign({ ...user }),
    };
  }
}
