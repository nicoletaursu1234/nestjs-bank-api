import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { UserDTO } from './dto/user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @HttpCode(201)
  async signup(@Body() userCredentials: UserDTO): Promise<any> {
    return await this.userService.signup(userCredentials);
  }

  @Post('signin')
  @HttpCode(200)
  async signin(@Body() userCredentials: UserDTO): Promise<any> {
    return await this.userService.signin(userCredentials);
  }
}
