import { existsSync } from 'node:fs';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

export function loadEnvironment(root = fileURLToPath(new URL('../../', import.meta.url))) {
  const path = join(root, '.env');
  if (existsSync(path)) loadEnvFile(path);
}
