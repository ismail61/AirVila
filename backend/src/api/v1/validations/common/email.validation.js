import Joi from 'joi';
const emailValidation = ({
    email, body, subject
}) => {
    const joiSchema = Joi.object().keys({
        email: Joi.string().lowercase()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in', 'co'], }, }).required()
            .messages({
                'string.base': `Email should be a type of String`,
                'string.empty': `Email cannot be an empty field`,
                'string.email': `Please enter Correct Email ['com', 'net', 'in', 'co']`,
                'any.required': `Email is required.`,
            }),
        body: Joi.string().required()
            .messages({
                'string.base': `Email Body should be type of String`,
                'string.empty': `Email Body is Required`,
                'any.required': `Email Body is Required`
            }),
        subject: Joi.string().required()
            .messages({
                'string.base': `Email Subject should be type of String`,
                'string.empty': `Email Subject is Required`,
                'any.required': `Email Subject is Required`
            })
    })
    const { value, error } = joiSchema.validate({
        email, body, subject
    }, { escapeHtml: true })
    return { value, error }
}
export { emailValidation }