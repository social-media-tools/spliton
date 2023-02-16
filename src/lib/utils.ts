import path from 'path';

export function getAssetsDir() {
  const separator = path.sep;
  const split = __dirname.split(separator);
  const root = split.slice(0, split.length - 3).join(separator);
  return path.join(root, 'assets');
}
