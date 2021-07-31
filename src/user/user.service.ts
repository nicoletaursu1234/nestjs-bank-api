import {
  BadRequestException,
  ConflictException,
  forwardRef,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Account } from 'src/account/entities/account.entity';
import { AuthService } from 'src/auth/auth.service';
import { UserDTO } from './dto/user.dto';
import { User } from './entities/user.entity';
import { IUser } from './types';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}

  async createUser({ login, password }: UserDTO): Promise<Partial<User>> {
    try {
      const user = await new User({ login, password }).save();
      const account = await new Account({
        email: login,
      }).save();
      user.account = account;
      await user.save();

      return await this.authService.generateToken(user);
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException();
    }
  }

  async getUserByLogin(login: string): Promise<User> {
    return await User.findOne({ login }, { relations: ['account'] });
  }

  async signup(userCredentials: UserDTO): Promise<Partial<IUser>> {
    const { login, password } = userCredentials;

    if (!password || !login) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Please provide a login and a password',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const user = await this.getUserByLogin(login);

      if (user || user?.login === login) {
        throw new ConflictException({
          status: HttpStatus.CONFLICT,
          error: 'User already exists',
        });
      }
    } catch (e) {
      this.logger.error(e);

      throw e;
    }

    try {
      return await this.createUser({
        login,
        password,
      });
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException();
    }
  }

  async signin(userCredentials: UserDTO): Promise<any> {
    const { login, password } = userCredentials;
    let user;

    if (!password || !login) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: 'Please provide a login and a password',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      user = await this.getUserByLogin(login);

      if (!user) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          error: 'User not found',
        });
      }
    } catch (e) {
      this.logger.error(e);

      throw e;
    }

    try {
      const isPasswordCorrect =
        (await this.authService.encryptPassword(password)) === user.password;

      if (isPasswordCorrect) {
        const { accessToken, expiresIn } = await this.authService.generateToken(
          user,
        );
        return { accessToken, expiresIn };
      } else {
        throw new BadRequestException('Wrong password. Please try again');
      }
    } catch (e) {
      this.logger.error(e);

      throw e;
    }
  }
}
