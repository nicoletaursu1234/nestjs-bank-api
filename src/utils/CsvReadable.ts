import { Readable } from 'stream';

export default class CsvReadable extends Readable {
  private sent = false;

  constructor(private str: string) {
    super();
  }

  _read() {
    if (!this.sent) {
      this.push(this.str);
      this.sent = true;
    } else {
      this.push(null);
    }
  }
}
