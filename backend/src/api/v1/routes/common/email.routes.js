import { emailController } from '../../controllers/common';
import { tryCatchHandle } from '../../utils';

function emailRoutes(app) {
    // app.post('/send-email', tryCatchHandle(emailController().sendEmail));
}
export { emailRoutes };