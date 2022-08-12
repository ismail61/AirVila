import { createUser, findUser } from "../../services/user";
import { insertOtp, getOtp, updateOtp } from "../../services/temp"
import { error, generateToken, passwordCompare, objectValidatorEscape, generateRandomId, generatePasswordHash } from "../../utils"
import { userSignUpValidation } from "../../validations";
const TWO_MINUTES = 2 * 60 * 1000;

function authController() {
    return {
        signIn: async (req, res) => {
            const { email, phone, password } = req.body;

            const user = await findUser({ $or: [{ email }, { phone }] });
            if (!user) return error().resourceError(res, 'Invalid Credentials', 401);

            const passwordMatch = await passwordCompare(password, user);
            if (!passwordMatch) return error().resourceError(res, 'Invalid Credentials', 401);

            const token = generateToken(user);
            return res.status(200).json({ token });
        },

        signUp: async (req, res) => {
            // Validate all information
            const validation = userSignUpValidation(req.body);
            if (validation.error) return error().resourceError(res, validation.error?.details[0].message, 422);

            // De-Structure data from req.body
            const { email, phone, identityNumber } = req.body;

            //find a user is assigned to the same email
            const doesEmailMatch = await findUser({ email });
            if (doesEmailMatch) return error().resourceError(res, 'Email already exists. Please choose a different Email', 409);

            //find a user is assigned to the same phone number
            const doesPhoneMatch = await findUser({ phone });
            if (doesPhoneMatch) return error().resourceError(res, 'Phone Number already exists. Please choose a different Phone Number', 409);

            //find a user is assigned to the same identity number
            const doesIdentityMatch = await findUser({ identityNumber });
            if (doesIdentityMatch) return error().resourceError(res, 'ID Number already exists. Please choose a different ID Number', 409);

            const otp = 100000 + Math.floor(Math.random() * 900000);
            const message = `Your AirVila OTP is ${otp}`;

            const doestOtpExits = await getOtp({ phone });
            if (doestOtpExits) {
                await updateOtp({ phone }, { otp, expire_time: Date.now() + TWO_MINUTES });
                return res.status(200).json({ message });
            }

            await insertOtp({
                phone,
                otp,
                expire_time: Date.now() + TWO_MINUTES
            });
            return res.status(200).json({ message });
        },

        verifySignUp: async (req, res) => {
            // Validate all information
            const validation = userSignUpValidation(req.body);
            if (validation.error) return error().resourceError(res, validation.error?.details[0].message, 422);

            // De-Structure data from req.body
            const { email, phone, identityNumber, otp, password } = req.body;

            if (!otp) return error().resourceError(res, 'Please provide the valid OTP', 409);

            //find a user is assigned to the same email
            const doesEmailMatch = await findUser({ email });
            if (doesEmailMatch) return error().resourceError(res, 'Email already exists. Please choose a different Email', 409);

            //find a user is assigned to the same phone number
            const doesPhoneMatch = await findUser({ phone });
            if (doesPhoneMatch) return error().resourceError(res, 'Phone Number already exists. Please choose a different Phone Number', 409);

            //find a user is assigned to the same identity number
            const doesIdentityMatch = await findUser({ identityNumber });
            if (doesIdentityMatch) return error().resourceError(res, 'ID Number already exists. Please choose a different ID Number', 409);

            const verified = await getOtp({ phone, otp, expire_time: { $gt: Date.now() } });
            if (!verified) return error().resourceError(res, 'Invalid OTP or OTP is Expired', 409);

            //malicious data refactor
            const refactor_data = await objectValidatorEscape(req.body);


            const id = await generateRandomId();
            //password hash using bcrypt
            const hashPassword = await generatePasswordHash(password);

            // save into mongo db
            await createUser({
                id: `UID${id}`,
                ...refactor_data,
                password: hashPassword
            }, res);
            return res.status(201).json({ message: 'Sign Up Successful' });
        },
    }
}
export { authController };