
import { TransactionFee } from '../../database/admin';

export const addTransactionFee = async (data) => {
    try {
        return await TransactionFee.create(data);
    } catch (err) {
        console.log(err);
    }
}

export const getTransactionFee = async (query) => {
    try {
        return await TransactionFee.findOne(query).select('-__v').lean();
    } catch (err) {
        console.log(err);
    }
}

export const getTransactionFees = async (query) => {
    try {
        return await TransactionFee.find(query).lean().select('-__v');
    } catch (err) {
        console.log(err);
    }
}

export const updateTransactionFee = async (query, data) => {
    try {
        return await TransactionFee.findOneAndUpdate(query, data, { new: true }).select('-__v').lean();
    } catch (err) {
        console.log(err);
    }
}