
import { PhoneOtpModel } from "../../database/common";

export const insertOtp = async (data) => {
    try {
        return await PhoneOtpModel.create(data);
    } catch (err) {
        console.log(err);
    }
}

export const getOtp = async (query) => {
    try {
        return await PhoneOtpModel.findOne(query).lean();
    } catch (err) {
        console.log(err);
    }
}

export const updateOtp = async (query, data) => {
    try {
        return await PhoneOtpModel.findOneAndUpdate(query, data).lean();
    } catch (err) {
        console.log(err);
    }
}