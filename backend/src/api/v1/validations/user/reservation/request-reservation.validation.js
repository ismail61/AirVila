import Joi from 'joi';

const requestReservationValidation = ({
    info, price, listingId, hostId, grandTotal
}) => {
    const joiSchema = Joi.object().keys({
        listingId: Joi.string().required()
            .messages({
                "string.base": `First Name should be a type of String`,
                "any.required": `Listing Id is Required`,
            }),
        hostId: Joi.string().required()
            .messages({
                "string.base": `Last Name should be a type of String`,
                "any.required": `Host Id is Required`,
            }),
        price: Joi.object().keys({
            base: Joi.number().required()
                .messages({
                    "number.base": `Base Price should be type of Number`,
                    "any.required": `Base Price is Required.`
                }),
            additionalGuestRent: Joi.number()
                .messages({
                    "number.base": `Additional Guest Price should be type of Number`,
                }),
            cleaningFee: Joi.number()
                .messages({
                    "number.base": `Cleaning Fee should be type of Number`,
                }),
            carParkingFee: Joi.number()
                .messages({
                    "number.base": `Car Parking Fee should be type of Number`,
                }),
            serviceFee: Joi.number().required()
                .messages({
                    "number.base": `Service Fee should be type of Number`,
                    "any.required": `Service Fee is Required.`
                }),
            additionalPetsRent: Joi.number()
                .messages({
                    "number.base": `Additional Pet Rent should be type of Number`,
                }),
            voucherDiscountAmount: Joi.number()
                .messages({
                    "number.base": `Voucher Discount Amount should be type of Number`,
                }),
            totalCost: Joi.number().required()
                .messages({
                    "number.base": `Total Price should be type of Number`,
                    "any.required": `Total Price is Required.`
                }),
        }).required().messages({
            "any.required": `Price is Required.`
        }),
        info: Joi.object().keys({
            checkInTime: Joi.date().required()
                .messages({
                    "date.base": `Check In Time should be type of Date`,
                    "any.required": `Check In Time is Required.`
                }),
            checkOutTime: Joi.date().required()
                .messages({
                    "date.base": `Check Out Time should be type of Date`,
                    "any.required": `Check Out Time is Required.`
                }),
            title: Joi.string().required()
                .messages({
                    "string.base": `Listing Title should be a type of String`,
                    "string.email": `Listing Title is Required`,
                }),
            photo: Joi.string().required()
                .messages({
                    "string.base": `Listing Photo should be a type of String`,
                    "string.email": `Listing Photo is Required`,
                }),
            guest: Joi.object().keys({
                adult: Joi.number().required().min(1)
                    .messages({
                        "number.base": `Adult Guest should be type of Number`,
                        "number.min": `Minimum 1 Adult Guest is Required.`,
                        "any.required": `Adult Guest is Required.`
                    }),
                child: Joi.number()
                    .messages({
                        "number.base": `Child Guest should be type of Number`,
                    }),
            }).required().messages({
                "any.required": `Guest Quantity is Required.`
            }),
            pets: Joi.number()
                .messages({
                    "number.base": `Pets Quantity should be type of Number`,
                }),
            cars: Joi.number()
                .messages({
                    "number.base": `Cars Quantity should be type of Number`,
                }),
        }).required().messages({
            "any.required": `Info is Required.`
        }),
        grandTotal: Joi.number().required()
            .messages({
                "number.base": `Grand Total Price should be type of Number`,
                "any.required": `Grand Total Price is Required.`
            }),
    })
    const { value, error } = joiSchema.validate({
        info, price, listingId, hostId, grandTotal
    }, { escapeHtml: true })
    return { value, error }
}

export { requestReservationValidation }