
import { globalErrorHandler } from '../../utils';
import { UserWallet } from '../../database/user';

export const findWallet = async (query) => {
    try {
        return await UserWallet.findOne(query).lean();
    } catch (err) {
        console.log(err);
    }
}

export const createWallet = async (data, res) => {
    try {
        return await UserWallet.create(data)
    } catch (err) {
        console.log(err);
        globalErrorHandler(err, res);
    }
}

export const updateWallet = async (query, data) => {
    try {
        return await UserWallet.findOneAndUpdate(query, { $set: data }, { new: true }).select('-__v').lean();
    } catch (err) {
        console.log(err);
    }
}

export const getWallets = async (query, skip, limit) => {
    try {
        return await UserWallet.find(query).skip(skip).limit(limit).lean();
    } catch (err) {
        console.log(err);
    }
}

export const addTransactionInWallet = async (query, transaction) => {
    try {
        return await UserWallet.findOneAndUpdate(query, { $push: { transactions: transaction } }).lean()
    } catch (err) {
        console.log(err);
    }
}