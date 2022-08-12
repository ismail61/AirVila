import Joi from 'joi';

const userSignUpValidation = ({ firstName, lastName, nickName, email, phone, password, identityType, identityNumber }) => {
    const joiSchema = Joi.object().keys({
        firstName: Joi.string().trim().required()
            .messages({
                "string.base": `First Name should be a type of String`,
                "string.empty": `First Name cannot be an empty field`,
                "any.required": `First Name is required.`
            }),
        lastName: Joi.string().trim().required()
            .messages({
                "string.base": `Last Name should be a type of String`,
                "string.empty": `Last Name cannot be an empty field`,
                "any.required": `Last Name is required.`
            }),
        nickName: Joi.string()
            .messages({
                "string.base": `Nick Name should be a type of String`,
            }),
        email: Joi.string().lowercase()
            .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in", "co"], }, }).required()
            .messages({
                "string.base": `Email should be a type of String`,
                "string.empty": `Email cannot be an empty field`,
                "string.email": `Please enter Correct Email`,
                "any.required": `Email is required.`,
            }),
        phone: Joi.string().regex(/^(?:\+88|88)?(01[3-9]\d{8})$/).required()
            .messages({
                "string.base": `Phone should be a type of Number`,
                "string.pattern.base": `Please Enter the Valid BD Phone number! `,
                "string.empty": `Phone cannot be an empty field`,
                "any.required": `Phone is required.`,
            }),
        identityType: Joi.string().required()
            .messages({
                "string.base": `ID Type should be a type of String`,
                "string.empty": `ID Type cannot be an empty field`,
                "any.required": `ID Type is required.`
            }),
        identityNumber: Joi.string().required()
            .messages({
                "string.base": `ID Number should be a type of ID Type`,
                "string.empty": `ID Number cannot be an empty field`,
                "any.required": `ID NUmber is required.`
            }),
        password: Joi.string().regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,}$/).min(6).required()
            .messages({
                "string.base": `Password should be a type of Text`,
                "string.pattern.base": `Password must be minimum 6 Characters with one special character and one number! `,
                "string.empty": `Password cannot be an empty field`,
                "any.required": `Password is required.`,
            }),
    })
    phone = phone?.toString();
    const { value, error } = joiSchema.validate({ firstName, lastName, nickName, email, phone, password, identityType, identityNumber }, { escapeHtml: true })
    return { value, error }
}

export { userSignUpValidation }