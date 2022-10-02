import { emailRoutes } from './email.routes';
import { imageRoutes } from './image.routes';
import { smsRoutes } from './sms.routes';

function commonRoutes(app) {
    imageRoutes(app);
    smsRoutes(app);
    emailRoutes(app);
}
export { commonRoutes };