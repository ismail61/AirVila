import Joi from 'joi';
const smsValidation = ({
    phone, body
}) => {
    const joiSchema = Joi.object().keys({
        phone: Joi.string().regex(/^(?:\+88|88)?(01[3-9]\d{8})$/).required()
            .messages({
                'string.base': `Phone should be a type of Number`,
                'string.pattern.base': `Please Enter the Valid BD Phone number! `,
                'string.empty': `Phone cannot be an empty field`,
                'any.required': `Phone is required.`,
            }),
        body: Joi.string().required()
            .messages({
                'string.base': `Sms Body should be type of String`,
                'string.empty': `Sms Body is Required`,
                'any.required': `Sms Body is Required`
            }),
    })
    phone = phone?.toString();
    const { value, error } = joiSchema.validate({
        phone, body
    }, { escapeHtml: true })
    return { value, error }
}
export { smsValidation }