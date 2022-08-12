import mongoose from "mongoose";
import { StringRequired } from "../../type/stringRequired";

// Otp Schema here
const otpSchema = mongoose.Schema({
    phone: {
        ...StringRequired,
        index: true,
        unique: true
    },
    otp: {
        ...StringRequired,
        index: true
    },
    expire_time: Date
})

export default mongoose.model('Otp', otpSchema);