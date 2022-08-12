import Joi from 'joi';

const createListingValidation = ({
    title, description, descriptionOfArea, place, specialty,
    size, photos, price, discount, address, guestsCapacity, bedsCapacity,
    bedRoomsCapacity, bathRoomsCapacity, kitchensCapacity, carQuantityCapacity,
}) => {
    const joiSchema = Joi.object().keys({
        title: Joi.string().max(60).required()
            .messages({
                "string.base": `Title should be a type of String`,
                'string.max': `Title should have a maximum length of 60`,
                "string.empty": `Title cannot be an empty field`,
                "any.required": `Title is required.`,
            }),
        description: Joi.string().max(500).required()
            .messages({
                "string.base": `Description should be a type of String`,
                'string.max': `Description should have a maximum length of 500`,
                "string.empty": `Description cannot be an empty field`,
                "any.required": `Description is required.`,
            }),
        descriptionOfArea: Joi.string().max(250).required()
            .messages({
                "string.base": `Description of Area should be a type of String`,
                'string.max': `Description of Area should have a maximum length of 250`,
                "string.empty": `Description of Area cannot be an empty field`,
                "any.required": `Description of Area is required.`,
            }),
        place: Joi.object().keys({
            type: Joi.string().required()
                .messages({
                    "string.base": `Place Type should be type of String`,
                    "any.required": `Place Type is Required.`
                }),
            describe: Joi.string()
                .messages({
                    "string.base": `Place Describe should be type of String`,
                }),
            space: Joi.string().required()
                .messages({
                    "string.base": `Place Space should be type of String`,
                    "any.required": `Place Space is Required.`
                }),
        }).required().messages({
            "any.required": `Place is Required.`
        }),
        size: Joi.number().required()
            .messages({
                "number.base": `Size of Listing should be type of Number`,
                "any.required": `Size of Listing is Required.`
            }),
        specialty: Joi.array()
            .items(Joi.string()
                .messages({
                    "string.base": `Specialty should be type of String`,
                })).min(1).max(3).required().messages({
                    "array.min": `Minimum 1 Specialty is Required`,
                    "array.max": `Maximum 3 Specialty is Required`,
                    "any.required": `Specialty is Required.`
                }),
        photos: Joi.array()
            .items(Joi.object().keys({
                url: Joi.string().required()
                    .messages({
                        "string.base": `Photo URL should be type of String`,
                        "any.required": `Photo URL is Required.`
                    }),
            })).min(5).max(20).required().messages({
                "array.min": `Minimum 5 Photos is Required`,
                "array.max": `Maximum 20 Photos is Required`,
                "any.required": `Photos is Required.`
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
            carParking: Joi.number()
                .messages({
                    "number.base": `Car Parking Fee should be type of Number`,
                }),
        }).required().messages({
            "any.required": `Price is Required.`
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
            houseNo: Joi.string().required()
                .messages({
                    "string.base": `House Number should be type of String`,
                    "any.required": `House Number is Required.`
                }),
            floor: Joi.string().required()
                .messages({
                    "string.base": `Floor or Apart should be type of String`,
                    "any.required": `Floor or Apart is Required.`
                }),
            roadNo: Joi.string().required()
                .messages({
                    "string.base": `Road Number should be type of String`,
                    "any.required": `Road Number is Required.`
                }),
            block: Joi.string()
                .messages({
                    "string.base": `Block No should be type of String`,
                }),
            area: Joi.string().required()
                .messages({
                    "string.base": `Area should be type of String`,
                    "any.required": `Area is Required.`
                }),
            thana: Joi.string().required()
                .messages({
                    "string.base": `Thana type of String`,
                    "any.required": `Thana is Required.`
                }),
            city: Joi.string().required()
                .messages({
                    "string.base": `City should be type of String`,
                    "any.required": `City is Required.`
                }),
            state: Joi.string().required()
                .messages({
                    "string.base": `State should be type of String`,
                    "any.required": `State is Required.`
                }),
            zipCode: Joi.string()
                .messages({
                    "string.base": `Zip Code should be type of String`,
                }),
            country: Joi.string().required()
                .messages({
                    "string.base": `Country should be type of String`,
                    "any.required": `Country is Required.`
                }),
        }).required().messages({
            "any.required": `Address is Required.`
        }),
        guestsCapacity: Joi.number().min(1).max(30).required()
            .messages({
                "number.base": `Guest Capacity should be type of Number`,
                "number.min": `Minimum 1 Guest Capacity is Required`,
                "number.max": `Maximum 30 Guests Capacity is Required`,
                "any.required": `Guest Capacity is Required.`
            }),
        bedsCapacity: Joi.number().min(1).max(50).required()
            .messages({
                "number.base": `Bed Capacity should be type of Number`,
                "number.min": `Minimum 1 Bed Capacity is Required`,
                "number.max": `Maximum 50 Beds Capacity is Required`,
                "any.required": `Bed Capacity is Required.`
            }),
        bedRoomsCapacity: Joi.number().min(1).max(50).required()
            .messages({
                "number.base": `BedRoom Capacity should be type of Number`,
                "number.min": `Minimum 1 BedRoom Capacity is Required`,
                "number.max": `Maximum 50 BedRooms Capacity is Required`,
                "any.required": `BedRoom Capacity is Required.`
            }),
        bathRoomsCapacity: Joi.number().min(1).max(50).required()
            .messages({
                "number.base": `BathRoom Capacity should be type of Number`,
                "number.min": `Minimum 1 BathRoom Capacity is Required`,
                "number.max": `Maximum 50 BathRooms Capacity is Required`,
                "any.required": `BathRoom Capacity is Required.`
            }),
        kitchensCapacity: Joi.number().max(20).required()
            .messages({
                "number.base": `Kitchen Capacity should be type of Number`,
                "number.max": `Maximum 20 Kitchens Capacity is Required`,
                "any.required": `Kitchen Capacity is Required.`
            }),
        carQuantityCapacity: Joi.number().max(30).required()
            .messages({
                "number.base": `Car Quantity Capacity should be type of Number`,
                "number.max": `Maximum 30 Car Quantity Capacity is Required`,
                "any.required": `Car Quantity Capacity is Required.`
            }),
    })

    const { value, error } = joiSchema.validate({
        title, description, descriptionOfArea, place, specialty,
        size, photos, price, discount, address, guestsCapacity, bedsCapacity,
        bedRoomsCapacity, bathRoomsCapacity, kitchensCapacity, carQuantityCapacity, 
    }, { escapeHtml: true })
    return { value, error }
}

export { createListingValidation }