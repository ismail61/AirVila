import { createUser, findUser, updateUser } from "../../services/user";
import { insertOtp, getOtp, updateOtp } from "../../services/temp"
import { error, generateToken, passwordCompare, objectValidatorEscape, generateRandomId, generatePasswordHash } from "../../utils"
import { userSignUpValidation, userUpdateInfoRequestValidation } from "../../validations";
const TWO_MINUTES = 2 * 60 * 1000;

function accountController() {
    return {
        getMe: async (req, res) => {
            const user = await findUser({ _id: req.user?._id });
            if (!user) return error().resourceError(res, 'User Not Found', 401);
            const { password, ...rest } = user;
            return res.status(200).json(rest);
        },
        updateRequest: async (req, res) => {
            // De-Structure data from req.body
            const { firstName, lastName, gender, email, phone, identityNumber, ...rest } = req.body;

            // Validate all information
            const validation = userUpdateInfoRequestValidation(req.body);
            if (validation.error) return error().resourceError(res, validation.error?.details[0].message, 422);

            //find a user is assigned to the same email
            const doesEmailMatch = email && await findUser({ email, _id: { $ne: req.user?._id } });
            if (doesEmailMatch) return error().resourceError(res, 'Email already exists. Please choose a different Email', 409);

            //find a user is assigned to the same phone number
            const doesPhoneMatch = phone && await findUser({ phone, _id: { $ne: req.user?._id } });
            if (doesPhoneMatch) return error().resourceError(res, 'Phone Number already exists. Please choose a different Phone Number', 409);

            //find a user is assigned to the same identity number
            const doesIdentityMatch = identityNumber && await findUser({ identityNumber, _id: { $ne: req.user?._id } });
            if (doesIdentityMatch) return error().resourceError(res, 'ID Number already exists. Please choose a different ID Number', 409);

            const user = await updateUser({ _id: req.user?._id }, {
                ...rest,
                updateRequest: {
                    firstName: firstName || undefined,
                    lastName: lastName || undefined,
                    gender: gender || undefined,
                    phone: phone || undefined,
                    identityNumber: identityNumber || undefined,
                }
            });
            return res.status(200).json(user);
        },
    }
}
export { accountController };