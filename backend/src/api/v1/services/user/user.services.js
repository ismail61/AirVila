
import { globalErrorHandler } from '../../utils';
import { UserModel } from '../../database/user';
import { createWallet } from './wallet.services';

export const findUser = async (query) => {
    try {
        return await UserModel.findOne(query).select('-orderedHost').lean();
    } catch (err) {
        console.log(err);
    }
}

export const createUser = async (data, res) => {
    try {
        const user = await UserModel.create(data);
        // create transactions wallet
        await createWallet({
            userId: user?._id
        }, res);
        await createWallet({
            userId: user?._id,
            userType: 'host'
        }, res);
        return user;
    } catch (err) {
        console.log(err);
        globalErrorHandler(err, res);
    }
}

export const updateUser = async (query, data) => {
    try {
        return await UserModel.findOneAndUpdate(query, { $set: data }, { new: true }).select('-__v -password -orderedHost').lean();
    } catch (err) {
        console.log(err);
    }
}

export const getUsers = async (query, skip, limit) => {
    try {
        return await UserModel.find(query).skip(skip).limit(limit).lean();
    } catch (err) {
        console.log(err);
    }
}