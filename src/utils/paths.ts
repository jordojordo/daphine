import path from 'path';

// dist/api up twice to /usr/src/app, then /assets
export const ASSETS_DIR =  process.env.ASSETS_DIR ? path.resolve(process.env.ASSETS_DIR) : path.resolve(__dirname, '../../assets');
