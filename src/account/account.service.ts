import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import sizeOf from 'image-size';
import { CountService } from 'src/count/count.service';
import { User } from 'src/user/entities/user.entity';
import { Account } from './entities/account.entity';
import imageScale from 'src/utils/imageScale';
import { createHmac } from 'crypto';
import AccountDTO from './dto/account.dto';

@Injectable()
export class AccountService {
  private readonly logger = new Logger(AccountService.name);

  constructor(private readonly countService: CountService) {}

  async update(body: AccountDTO, user: User): Promise<Partial<Account>> {
    const { account } = user;
    let accountUpdate;
    let accountWithCount;

    try {
      accountUpdate = await new Account({ ...account, ...body }).save();
      accountWithCount = await Account.findOne({
        where: { id: accountUpdate.id },
        relations: ['count'],
      });
    } catch (e) {
      this.logger.error(e);

      throw new InternalServerErrorException();
    }

    if (!accountUpdate.count.length) {
      try {
        const count = await this.countService.create(accountWithCount);

        delete accountWithCount.count;
        accountWithCount.count = count;
        accountWithCount.save();
      } catch (e) {
        this.logger.error(e);

        throw new InternalServerErrorException();
      }
    }

    return accountWithCount;
  }

  async uploadAvatar(
    file: Express.Multer.File,
    user: User,
  ): Promise<Partial<Account>> {
    const { account } = user;
    const imageTypes = ['jpg', 'jpeg', 'png'];
    const { mimetype, size, buffer } = file;

    const { height, width } = sizeOf(buffer);
    const [, format] = mimetype.split('/');
    const errors = [];

    if (!imageTypes.includes(format)) {
      errors.push('Image format should be PNG or JPG');
    }

    if (size > 1e6) {
      errors.push('Image size is too big');
    }

    if (width > 2000 || height > 2000) {
      errors.push(
        'Image dimensions are too big. Should be less than 2000x2000px',
      );
    }

    if (errors.length) {
      throw new BadRequestException(errors);
    }

    try {
      const hash = createHmac('sha256', user.login).digest('hex');
      const imagePath = await imageScale(buffer, `${hash}.jpeg`);

      return await new Account({ ...account, avatar: imagePath }).save();
    } catch (e) {
      this.logger.error(e);

      throw e;
    }
  }
}
