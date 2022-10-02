import { WishlistModel } from '../../database/user';

export const getWishlist = async (query) => {
    try {
        return await WishlistModel.findOne(query).populate('items.listingId', 'title id _id  description photos price rating').lean();
    } catch (err) {
        console.log(err);
    }
}

export const createWishlist = async (data) => {
    try {
        const newWishlist = new WishlistModel(data);
        return await newWishlist.save();
    } catch (err) {
        console.log(err);
    }
}

export const addItemInWishlist = async (query, data) => {
    try {
        return await WishlistModel.findOneAndUpdate(query, { $push: data }, { new: true }).lean()
    } catch (err) {
        console.log(err);
    }
}

export const deleteWishlistById = async (wishlistId) => {
    try {
        return await WishlistModel.findByIdAndRemove(wishlistId).lean();
    } catch (err) {
        console.log(err);
    }
}

export const WishlistItemDelete = async (query, data) => {
    try {
        return await WishlistModel.findOneAndUpdate(query, { $pull: data }, { new: true }).lean().exec()
    } catch (err) {
        console.log(err);
    }
}