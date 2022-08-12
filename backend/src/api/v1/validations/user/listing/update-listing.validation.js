import Joi from 'joi';

const updateListingValidation = ({
    title, description, descriptionOfArea, place, specialty,
    size, photos, price, discount, address, guestsCapacity, bedsCapacity,
    bedRoomsCapacity, bathRoomsCapacity, kitchensCapacity, carQuantityCapacity,
    lengthOfStay, checkInTime, checkOutTime, coHost, availability
}) => {
    const joiSchema = Joi.object().keys({
        title: Joi.string().max(60)
            .messages({
                "string.base": `Title should be a type of String`,
                'string.max': `Title should have a maximum length of 60`,
                "string.empty": `Title cannot be an empty field`,
            }),
        description: Joi.string().max(500)
            .messages({
                "string.base": `Description should be a type of String`,
                'string.max': `Description should have a maximum length of 500`,
                "string.empty": `Description cannot be an empty field`,
            }),
        descriptionOfArea: Joi.string().max(250)
            .messages({
                "string.base": `Description of Area should be a type of String`,
                'string.max': `Description of Area should have a maximum length of 250`,
                "string.empty": `Description of Area cannot be an empty field`,
            }),
        place: Joi.object().keys({
            type: Joi.string()
                .messages({
                    "string.base": `Place Type should be type of String`,
                }),
            describe: Joi.string()
                .messages({
                    "string.base": `Place Describe should be type of String`,
                }),
            space: Joi.string()
                .messages({
                    "string.base": `Place Space should be type of String`,
                }),
        }),
        size: Joi.number()
            .messages({
                "number.base": `Size of Listing should be type of Number`,
            }),
        specialty: Joi.array()
            .items(Joi.string()
                .messages({
                    "string.base": `Specialty should be type of String`,
                })).min(1).max(3).messages({
                    "array.min": `Minimum 1 Specialty is Required`,
                    "array.max": `Maximum 3 Specialty is Required`,
                }),
        photos: Joi.array()
            .items(Joi.object().keys({
                url: Joi.string()
                    .messages({
                        "string.base": `Photo URL should be type of String`,
                    }),
            })).min(5).max(20).messages({
                "array.min": `Minimum 5 Photos is Required`,
                "array.max": `Maximum 20 Photos is Required`,
            }),
        price: Joi.object().keys({
            base: Joi.number()
                .messages({
                    "number.base": `Base Price should be type of Number`,
                }),
            additionalGuestRent: Joi.number()
                .messages({
                    "number.base": `Additional Guest Price should be type of Number`,
                }),
            cleaningFee: Joi.number()
                .messages({
                    "number.base": `Cleaning Fee should be type of Number`,
                }),
            carParking: Joi.number()
                .messages({
                    "number.base": `Car Parking Fee should be type of Number`,
                }),
        }),
        discount: Joi.object().keys({
            flat: Joi.number()
                .messages({
                    "number.base": `Flat Discount should be type of Number`,
                }),
            threeDays: Joi.number()
                .messages({
                    "number.base": `Three Days Discount should be type of Number`,
                }),
            weekly: Joi.number()
                .messages({
                    "number.base": `Weekly Discount should be type of Number`,
                }),
            monthly: Joi.number()
                .messages({
                    "number.base": `Monthly Discount should be type of Number`,
                }),
        }),
        address: Joi.object().keys({
            houseNo: Joi.string()
                .messages({
                    "string.base": `House Number should be type of String`,
                }),
            floor: Joi.string()
                .messages({
                    "string.base": `Floor or Apart should be type of String`,
                }),
            roadNo: Joi.string()
                .messages({
                    "string.base": `Road Number should be type of String`,
                }),
            block: Joi.string()
                .messages({
                    "string.base": `Block No should be type of String`,
                }),
            area: Joi.string()
                .messages({
                    "string.base": `Area should be type of String`,
                }),
            thana: Joi.string()
                .messages({
                    "string.base": `Thana type of String`,
                }),
            city: Joi.string()
                .messages({
                    "string.base": `City should be type of String`,
                }),
            state: Joi.string()
                .messages({
                    "string.base": `State should be type of String`,
                }),
            zipCode: Joi.string()
                .messages({
                    "string.base": `Zip Code should be type of String`,
                }),
            country: Joi.string()
                .messages({
                    "string.base": `Country should be type of String`,
                }),
        }),
        guestsCapacity: Joi.number().min(1).max(30)
            .messages({
                "number.base": `Guest Capacity should be type of Number`,
                "number.min": `Minimum 1 Guest Capacity is Required`,
                "number.max": `Maximum 30 Guests Capacity is Required`,
            }),
        bedsCapacity: Joi.number().min(1).max(50)
            .messages({
                "number.base": `Bed Capacity should be type of Number`,
                "number.min": `Minimum 1 Bed Capacity is Required`,
                "number.max": `Maximum 50 Beds Capacity is Required`,
            }),
        bedRoomsCapacity: Joi.number().min(1).max(50)
            .messages({
                "number.base": `BedRoom Capacity should be type of Number`,
                "number.min": `Minimum 1 BedRoom Capacity is Required`,
                "number.max": `Maximum 50 BedRooms Capacity is Required`,
            }),
        bathRoomsCapacity: Joi.number().min(1).max(50)
            .messages({
                "number.base": `BathRoom Capacity should be type of Number`,
                "number.min": `Minimum 1 BathRoom Capacity is Required`,
                "number.max": `Maximum 50 BathRooms Capacity is Required`,
            }),
        kitchensCapacity: Joi.number().max(20)
            .messages({
                "number.base": `Kitchen Capacity should be type of Number`,
                "number.max": `Maximum 20 Kitchens Capacity is Required`,
            }),
        carQuantityCapacity: Joi.number().max(30)
            .messages({
                "number.base": `Car Quantity Capacity should be type of Number`,
                "number.max": `Maximum 30 Car Quantity Capacity is Required`,
            }),
        lengthOfStay: Joi.object().keys({
            minimum: Joi.number()
                .messages({
                    "number.base": `Minimum stay of length should be type of Number`,
                }),
            maximum: Joi.number()
                .messages({
                    "number.base": `Maximum stay of length should be type of Number`,
                }),
        }),
        checkInTime: Joi.object().keys({
            checkInTimeType: Joi.string()
                .messages({
                    "string.base": `Check In Time Type should be type of String`,
                }),
            time: Joi.string()
                .messages({
                    "string.base": `Check In Time should be type of String`,
                }),
        }),
        checkOutTime: Joi.object().keys({
            checkOutTimeType: Joi.string()
                .messages({
                    "string.base": `Check Out Time Type should be type of String`,
                }),
            time: Joi.string()
                .messages({
                    "string.base": `Check Out Time should be type of String`,
                }),
        }),
        coHost: Joi.object().keys({
            name: Joi.string()
                .messages({
                    "string.base": `Co Host Name should be type of String`,
                }),
            phone: Joi.string()
                .messages({
                    "string.base": `Co Host Phone should be type of String`,
                }),
        }),
        availability: Joi.object().keys({
            futureBookingMonths: Joi.number()
                .messages({
                    "number.base": `Future Booking Months should be type of Number`,
                }),
            advanceNoticeBookingDays: Joi.number()
                .messages({
                    "number.base": `Advanced Notice Booking Days should be type of Number`,
                }),
        }),
    })

    const { value, error } = joiSchema.validate({
        title, description, descriptionOfArea, place, specialty,
        size, photos, price, discount, address, guestsCapacity, bedsCapacity,
        bedRoomsCapacity, bathRoomsCapacity, kitchensCapacity, carQuantityCapacity,
        lengthOfStay, checkInTime, checkOutTime, coHost, availability
    }, { escapeHtml: true })
    return { value, error }
}

export { updateListingValidation }