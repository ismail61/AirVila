
import { globalErrorHandler } from "../../utils";
import { ListingModel } from "../../database/common";

export const findListing = async (query) => {
    try {
        const listing = await ListingModel.findOne(query).select('-__v -coHost -status').populate({
            path: 'userId',
            model: 'User',
            select: 'id firstName lastName createdAt rating hostRating languages image'
        }).lean();

        return listing ? {
            ...listing,
            address: {
                city: listing?.address?.city,
                state: listing?.address?.state
            },
            userId: {
                ...listing?.userId,
                rating: listing?.userId?.rating?.avg || 0,
                ratingCount: listing?.userId?.hostRating?.length || 0
            }
        } : null;
    } catch (err) {
        console.log(err);
    }
}

export const findAllListing = async (query, skip, limit) => {
    try {
        return await ListingModel.find(query).skip(skip).limit(limit).lean();
    } catch (err) {
        console.log(err);
    }
}

export const findAllHomeListing = async (query, skip, limit) => {
    try {
        return await ListingModel.find(query).select('id title description descriptionOfArea place photos rating price').skip(skip).limit(limit).lean();
    } catch (err) {
        console.log(err);
    }
}

export const createListing = async (data, res) => {
    try {
        return await ListingModel.create(data)
    } catch (err) {
        console.log(err);
        globalErrorHandler(err, res);
    }
}

export const updateListing = async (query, data) => {
    try {
        return await ListingModel.findOneAndUpdate(query, { $set: data })
    } catch (err) {
        console.log(err);
    }
}

export const generateSearchQuery = (condition) => {
    const { area, city, title, state, placeType, placeSpace, guestsCapacity, petsCapacity } = condition;
    const query = {};
    if (area !== undefined && area !== '') {
        query['address.area'] = new RegExp(area, 'i');
    }
    if (city !== undefined && city !== '') {
        query['address.city'] = new RegExp(city, 'i');
    }
    if (state !== undefined && state !== '') {
        query['address.state'] = state;
    }
    if (placeType !== undefined && placeType !== '') {
        query['place.type'] = placeType;
    }
    if (placeSpace !== undefined && placeSpace !== '') {
        query['place.space'] = new RegExp(placeSpace, 'i');
    }
    if (guestsCapacity !== undefined && guestsCapacity !== '') {
        query['guestsCapacity'] = parseInt(guestsCapacity);
    }
    if (petsCapacity !== undefined && petsCapacity !== '' && parseInt(petsCapacity) !== 0) {
        query['pets.allowed'] = parseInt(petsCapacity) === 0 ? false : true;
    }
    if (title !== undefined && title !== '') {
        query.title = new RegExp(title, 'i');
    }
    return query;
}