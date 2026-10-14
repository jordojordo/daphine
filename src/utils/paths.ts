import path from 'path';
import fs from 'fs';

// dist/api up twice to /usr/src/app, then /assets
export const ASSETS_DIR =  process.env.ASSETS_DIR ? path.resolve(process.env.ASSETS_DIR) : path.resolve(__dirname, '../../assets');

/** Resolves a requested asset to a file inside ASSETS_DIR/<subdir> */
export const resolveAsset = (subdir: string, name: string): string | null => {
  if (!name || name === '.' || name === '..' || name.includes('\0') || path.basename(name) !== name) {
    return null;
  }

  const assetPath = path.join(ASSETS_DIR, subdir, name);
  const stats = fs.statSync(assetPath, { throwIfNoEntry: false });

  return stats?.isFile() ? assetPath : null;
};
