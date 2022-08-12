import Joi from "joi";

const wishlistItemValidation = ({ listingId, guestsCapacity, petsCapacity }) => {
    const joiSchema = Joi.object().keys({
        listingId: Joi.string().hex().length(24).required()
            .messages({
                "string.base": `Listing ID should be type of ObjectID`,
                "any.required": `Listing ID is Required.`
            }),
        guestsCapacity: Joi.number().required()
            .messages({
                "number.base": `Guests Capacity should be type of Number`,
                "any.required": `Guests Capacity is Required.`
            }),
        petsCapacity: Joi.number()
            .messages({
                "number.base": `Pets Capacity should be type of Number`,
            }),
    })
    const { value, error } = joiSchema.validate({ listingId, guestsCapacity, petsCapacity }, { escapeHtml: true })
    return { value, error }
}

export { wishlistItemValidation }