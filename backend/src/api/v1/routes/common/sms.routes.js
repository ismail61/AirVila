import { smsController } from '../../controllers/common';
import { tryCatchHandle } from '../../utils';

function smsRoutes(app) {
    // app.post('/send-sms', tryCatchHandle(smsController().sendSms));
}
export { smsRoutes };