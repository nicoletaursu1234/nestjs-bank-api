import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import sizeOf from 'image-size';
import { CountService } from 'src/count/count.service';
import { User } from 'src/user/entities/user.entity';
import AccountDTO from './dto/account.dto';
import { Account } from './entities/account.entity';
import imageScale from 'src/utils/imageScale';
import { createHmac } from 'crypto';

@Injectable()
export class AccountService {
  constructor(private readonly countService: CountService) {}

  async update(body: AccountDTO, user: User): Promise<Partial<Account>> {
    const { account } = user;
    const accountUpdate = await new Account({ ...account, ...body }).save();

    const accountWithCount = await Account.findOne({
      where: { id: accountUpdate.id },
      relations: ['count'],
    });

    if (!accountWithCount.count.length) {
      const count = await this.countService.create(accountWithCount);

      delete count.account;
      accountUpdate.count = [count];
      await accountUpdate.save();
    }

    return accountWithCount;
  }

  async uploadAvatar(
    file: Express.Multer.File,
    user: User,
  ): Promise<Partial<Account>> {
    const imageTypes = ['jpg', 'png'];
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
      throw new BadRequestException();
    }

    try {
      const hash = createHmac('sha256', user.login).digest('hex');
      const imagePath = await imageScale(buffer, `${hash}.jpeg`);
      console.log(imagePath);
      if (!imagePath)
        throw new ConflictException({ error: 'Image already exists ' });

      return await this.update({ avatar: imagePath }, user);
    } catch (e) {
      console.error(e);

      throw new InternalServerErrorException();
    }
  }
}
