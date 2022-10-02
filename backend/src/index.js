import 'dotenv/config.js';
import { bootstrap } from './api/v1/bootstrap';

(async () => {
  await bootstrap();
})();

console.log('AIRVILA...');

