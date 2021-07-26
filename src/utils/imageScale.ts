import { read } from 'jimp';
import { resolve } from 'path';

export default async (buffer, newName, scale = 120): Promise<string> => {
  const pathResolve = resolve(__dirname, '../../public/avatar', newName);
  let path = '/public/user-avatar';

  path += `/${newName}`;

  const image = await read(buffer);

  await image.scaleToFit(scale, scale).write(pathResolve);

  return path;
};
