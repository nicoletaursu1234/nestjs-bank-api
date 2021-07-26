import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream, statSync } from 'fs';
import { resolve } from 'path';

@Injectable()
export class AppService {
  async getVideo(range: string, res: Response): Promise<void> {
    const videoPath = resolve(__dirname, '../public/video/brutal_song.mp4');
    const { size } = statSync(videoPath);
    const resHeaders = {
      'Content-Type': 'video/mp4',
      'Content-Length': size,
    };
    const [start, end] = range.replace('bytes=', '').split('-');

    if (range) {
      const newEnd = end || size - 1;
      resHeaders['Content-Length'] = +newEnd - +start + 1;
      resHeaders['Content-Range'] = `bytes ${start}-${newEnd}/${size}`;
      resHeaders['Accept-Ranges'] = `bytes`;

      res.writeHead(206, resHeaders);

      const stream = createReadStream(videoPath, {
        start: +start,
        end: +newEnd,
      });

      stream.pipe(res);
    } else {
      res.writeHead(200, resHeaders);
      createReadStream(videoPath).pipe(res);
    }
  }
}
