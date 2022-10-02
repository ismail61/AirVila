

import { sendSms } from '../../services/common';
import { error } from '../../utils';
import { smsValidation } from '../../validations';

function smsController() {
    return {
        sendSms: async (req, res) => {
            const validation = smsValidation(req.body);
            if (validation.error) return error().resourceError(res, validation.error?.details[0].message, 422);
            await sendSms(req.body, res);
        },
    }
}
export { smsController };