import { readdir, stat } from 'node:fs/promises';
import { join, extname, basename } from 'node:path';
import sharp from 'sharp';

const folders = [
  'public/images/accesorios-hombres',
  'public/images/accesorios-mujeres',
];
const MAX_SIZE = 1000;

for (const folder of folders) {
  const files = await readdir(folder);

  for (const file of files) {
    if (extname(file).toLowerCase() !== '.png') continue;

    const input = join(folder, file);
    const output = join(folder, `${basename(file, extname(file))}.webp`);

    await sharp(input)
      .resize({
        width: MAX_SIZE,
        height: MAX_SIZE,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toFile(output);

    const before = (await stat(input)).size;
    const after = (await stat(output)).size;
    console.log(
      `${file}: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB`
    );
  }
}
