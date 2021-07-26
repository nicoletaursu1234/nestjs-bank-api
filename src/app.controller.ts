import { Controller, Get, Headers, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/video')
  async getVideo(
    @Headers('range') range: string,
    @Res() res: Response,
  ): Promise<void> {
    return await this.appService.getVideo(range, res);
  }
}
