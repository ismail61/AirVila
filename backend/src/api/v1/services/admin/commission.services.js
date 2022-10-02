
import { Commission } from '../../database/admin';

export const addCommission = async (data) => {
    try {
        return await Commission.create(data);
    } catch (err) {
        console.log(err);
    }
}

export const getCommission = async (query) => {
    try {
        return await Commission.findOne(query).select('-__v').lean();
    } catch (err) {
        console.log(err);
    }
}

export const getCommissions = async (query) => {
    try {
        return await Commission.find(query).select('-__v').lean();
    } catch (err) {
        console.log(err);
    }
}

export const updateCommission = async (query, data) => {
    try {
        return await Commission.findOneAndUpdate(query, data, { new: true }).select('-__v').lean();
    } catch (err) {
        console.log(err);
    }
}