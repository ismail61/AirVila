import Joi from 'joi';

const userUpdateInfoRequestValidation = ({
    firstName, lastName, gender, email, phone, identityNumber,
    aboutMe, profession, organization, languages, image
}) => {
    const joiSchema = Joi.object().keys({
        firstName: Joi.string()
            .messages({
                "string.base": `First Name should be a type of String`,
            }),
        lastName: Joi.string()
            .messages({
                "string.base": `Last Name should be a type of String`,
            }),
        email: Joi.string().lowercase()
            .email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "in", "co"], }, })
            .messages({
                "string.base": `Email should be a type of String`,
                "string.email": `Please enter Correct Email`,
            }),
        phone: Joi.string().regex(/^(?:\+88|88)?(01[3-9]\d{8})$/)
            .messages({
                "string.base": `Phone should be a type of Number`,
                "string.pattern.base": `Please Enter the Valid BD Phone number! `,
            }),
        gender: Joi.string()
            .messages({
                "string.base": `Gender should be a type of String`,
            }),
        identityNumber: Joi.string()
            .messages({
                "string.base": `ID Number should be a type of ID Type`,
            }),
        aboutMe: Joi.string()
            .messages({
                "string.base": `About Me should be a type of String`,
            }),
        profession: Joi.string()
            .messages({
                "string.base": `Profession should be a type of String`,
            }),
        organization: Joi.string()
            .messages({
                "string.base": `Organization should be a type of String`,
            }),
        languages: Joi.array()
            .items(Joi.string()
                .messages({
                    "string.base": `Languages be type of String`,
                })).messages({
                    "array.base": "Languages must be an array"
                }),
        image: Joi.string()
            .messages({
                "string.base": `Profile Image should be a type of String`,
            }),

    })
    const { value, error } = joiSchema.validate({
        firstName, lastName, gender, email, phone, identityNumber,
        aboutMe, profession, organization, languages, image
    }, { escapeHtml: true })
    return { value, error }
}

export { userUpdateInfoRequestValidation }