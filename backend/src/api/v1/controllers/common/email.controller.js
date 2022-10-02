import { sendEmail } from '../../services/common';
import { error } from '../../utils';
import { emailValidation } from '../../validations';

function emailController() {
    return {
        sendEmail: async (req, res) => {
            const validation = emailValidation(req.body);
            if (validation.error) return error().resourceError(res, validation.error?.details[0].message, 422);
            await sendEmail(req.body, res);
        },
    }
}
export { emailController };