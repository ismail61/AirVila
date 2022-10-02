import Joi from 'joi';

const requestReservationValidation = ({
    info, price, listingId, grandTotal, priceDates
}) => {
    const joiSchema = Joi.object().keys({
        listingId: Joi.string().required()
            .messages({
                'string.base': `First Name should be a type of String`,
                'any.required': `Listing Id is Required`,
            }),
        price: Joi.object().keys({
            additionalGuestRent: Joi.number()
                .messages({
                    'number.base': `Additional Guest Price should be type of Number`,
                }),
            cleaningFee: Joi.number()
                .messages({
                    'number.base': `Cleaning Fee should be type of Number`,
                }),
            carParkingFee: Joi.number()
                .messages({
                    'number.base': `Car Parking Fee should be type of Number`,
                }),
            additionalPetsRent: Joi.number()
                .messages({
                    'number.base': `Additional Pet Rent should be type of Number`,
                }),
            weeklyDiscount: Joi.number()
                .messages({
                    'number.base': `Weekly Discount Amount should be type of Number`,
                }),
            threeDaysDiscount: Joi.number()
                .messages({
                    'number.base': `Three Days Discount Amount should be type of Number`,
                }),
            monthlyDiscount: Joi.number()
                .messages({
                    'number.base': `Monthly Discount Amount should be type of Number`,
                }),
        }).required().messages({
            'any.required': `Price is Required.`
        }),
        info: Joi.object().keys({
            checkInTime: Joi.date().required()
                .messages({
                    'date.base': `Check In Time should be type of Date`,
                    'any.required': `Check In Time is Required.`
                }),
            checkOutTime: Joi.date().required()
                .messages({
                    'date.base': `Check Out Time should be type of Date`,
                    'any.required': `Check Out Time is Required.`
                }),
            title: Joi.string().required()
                .messages({
                    'string.base': `Listing Title should be a type of String`,
                    'string.email': `Listing Title is Required`,
                }),
            photo: Joi.string().required()
                .messages({
                    'string.base': `Listing Photo should be a type of String`,
                    'string.email': `Listing Photo is Required`,
                }),
            guest: Joi.object().keys({
                adult: Joi.number().required().min(1)
                    .messages({
                        'number.base': `Adult Guest should be type of Number`,
                        'number.min': `Minimum 1 Adult Guest is Required.`,
                        'any.required': `Adult Guest is Required.`
                    }),
                child: Joi.number()
                    .messages({
                        'number.base': `Child Guest should be type of Number`,
                    }),
            }).required().messages({
                'any.required': `Guest Quantity is Required.`
            }),
            pets: Joi.number()
                .messages({
                    'number.base': `Pets Quantity should be type of Number`,
                }),
            cars: Joi.number()
                .messages({
                    'number.base': `Cars Quantity should be type of Number`,
                }),
        }).required().messages({
            'any.required': `Info is Required.`
        }),
        grandTotal: Joi.number().required()
            .messages({
                'number.base': `Grand Total Price should be type of Number`,
                'any.required': `Grand Total Price is Required.`
            }),
        priceDates: Joi.array().items(
            Joi.object({
                date: Joi.date().required().messages({
                    'date.base': `PriceDates Date should be type of Date`,
                    'any.required': `PriceDates Date is Required.`
                }),
                price: Joi.number().required().messages({
                    'number.base': `PriceDates Price should be type of Number`,
                    'any.required': `PriceDates Price is Required.`
                })
            })
        ).min(1).required().messages({
            'any.required': `PriceDates is Required.`
        }),
    })
    const { value, error } = joiSchema.validate({
        info, price, listingId, grandTotal, priceDates
    }, { escapeHtml: true })
    return { value, error }
}

export { requestReservationValidation }