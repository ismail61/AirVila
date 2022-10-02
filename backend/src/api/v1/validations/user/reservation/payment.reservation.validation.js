import Joi from 'joi';

const paymentReservationValidation = ({
    payment
}) => {
    const joiSchema = Joi.object().keys({
        payment: Joi.object().keys({
            status: Joi.string().required()
                .messages({
                    "string.base": `Payment Status should be a type of String`,
                    "any.required": `Payment Status is Required.`
                }),
            customerInfo: Joi.object().keys({
                name: Joi.string().required()
                    .messages({
                        "string.base": `Customer Name should be a type of String`,
                        "any.required": `Customer Name is Required.`
                    }),
                email: Joi.string().required()
                    .messages({
                        "string.base": `Customer Email should be a type of String`,
                        "any.required": `Customer Email is Required.`
                    }),
                phone: Joi.string().required()
                    .messages({
                        "string.base": `Customer Phone should be a type of String`,
                        "any.required": `Customer Phone is Required.`
                    }),
                address: Joi.string().required()
                    .messages({
                        "string.base": `Customer Address should be a type of String`,
                        "any.required": `Customer Address is Required.`
                    }),
            }).required().messages({
                "any.required": `Customer Information is Required.`
            }),
            info: Joi.object().keys({
                total_amount: Joi.number().required()
                    .messages({
                        "string.base": `Payment Total Amount should be a type of Number`,
                        "any.required": `Payment Total Amount  is Required.`
                    }),
                tran_id: Joi.string().required()
                    .messages({
                        "string.base": `Payment Transaction ID should be a type of String`,
                        "any.required": `Payment Transaction ID is Required.`
                    }),
                currency: Joi.string()
                    .messages({
                        "string.base": `Payment Currency should be a type of String`,
                    }),
                emi_option: Joi.string()
                    .messages({
                        "string.base": `Customer EMI Option should be a type of String`,
                    }),
            }).required().messages({
                "any.required": `Payment Information is Required.`
            }),
        }).required().messages({
            "any.required": `Payment is Required.`
        }),
    })
    const { value, error } = joiSchema.validate({
        payment
    }, { escapeHtml: true })
    return { value, error }
}

export { paymentReservationValidation }