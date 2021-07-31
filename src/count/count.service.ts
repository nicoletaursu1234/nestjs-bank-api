import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { Count } from './entities/count.entity';

@Injectable()
export class CountService {
  private readonly logger = new Logger(CountService.name);

  async getByAccountNumber(accountNumber: string): Promise<Count> {
    try {
      return await Count.findOne({
        where: { accountNumber },
      });
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException();
    }
  }

  async create(account): Promise<Count> {
    let count;

    try {
      count = await new Count({
        accountNumber: Date.now().toString(),
        amount: 100.5,
        currency: 'USD',
        account,
      }).save();
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException();
    }

    return count;
  }
}
