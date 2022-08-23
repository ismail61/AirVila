import "dotenv/config.js";
import { bootstrap } from './api/v1/bootstrap';
import * as fs from 'fs';
import { join } from "path";

(async () => {
  await bootstrap();
})();

console.log('AIRVILA...');

