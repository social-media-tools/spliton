import os from 'os';
import path from 'path';

export function getAssetsDir() {
  const p = os.platform();
  const separator = p === 'win32' ? '\\' : '/';
  const split = __dirname.split(separator);
  const root = split.slice(0, split.length - 3).join(separator);
  return path.join(root, 'assets');
}
