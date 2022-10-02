import { config } from '../../../../config';
import request from 'request';
import { error } from '../../utils';

export const sendSms = async ({ phone, body }, res) => {
    try {
        const { sms } = config;
        var options = {
            'method': 'GET',
            'url': `${sms?.uri}?user=${sms?.user}&password=${sms?.password}&from=AirVila&to=${phone}&text=${body}`,
        };
        console.log(options)
        request(options, async function (err, response) {
            console.log(err)
            if (err) return error().resourceError(res, 'Something went wrong', 500);
            const code = response?.success;
            if (code === 0) {
                return error().resourceError(res, 'SMS Send Failed!', 422);
            }
            return res.status(200).json({ message: 'Message Send Successful. Please check your Phone Number' });
        });
        return;
    } catch (err) {
        console.log(err);
    }
}