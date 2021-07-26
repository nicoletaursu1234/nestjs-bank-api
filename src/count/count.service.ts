import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Count } from './entities/count.entity';

@Injectable()
export class CountService {
  async create(account): Promise<Count> {
    let count;

    try {
      count = await new Count({
        amount: 100.5,
        currency: 'USD',
        account,
      }).save();
    } catch (e) {
      throw new InternalServerErrorException();
    }

    return count;
  }
}
