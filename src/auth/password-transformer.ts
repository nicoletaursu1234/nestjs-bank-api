import { createHmac } from 'crypto';
import { ValueTransformer } from 'typeorm';

export default class PasswordTransformer implements ValueTransformer {
  to = (value: string): string => {
    const pass = createHmac('SHA256', value).digest('hex').toString();

    return pass;
  };

  from = (value: string): string => value;
}
