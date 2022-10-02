
import { ReservationModel } from '../../database/common';
import { globalErrorHandler } from '../../utils';

export const findReservation = async (query) => {
    try {
        return await ReservationModel.findOne(query).select('-__v').populate([
            {
                path: 'guestId',
                model: 'User',
                select: 'id firstName lastName createdAt rating hostRating image'
            },
            {
                path: 'hostId',
                model: 'User',
                select: 'id firstName lastName createdAt rating hostRating image'
            },
            {
                path: 'listingId',
                model: 'Listing',
                select: 'id address rating'
            },
        ]).lean();
    } catch (err) {
        console.log(err);
    }
}

export const findAllReservation = async (query, skip, limit) => {
    try {
        return await ReservationModel.find(query).skip(skip).limit(limit).lean();
    } catch (err) {
        console.log(err);
    }
}

export const createReservation = async (data, res) => {
    try {
        return await ReservationModel.create(data);
    } catch (err) {
        console.log(err);
        globalErrorHandler(err, res);
    }
}

export const updateReservation = async (query, data) => {
    try {
        return await ReservationModel.findOneAndUpdate(query, { $set: data }, { new: true });
    } catch (err) {
        console.log(err);
    }
}

export const guestCancelPriceCalculateBeforeCheckIn = async (reservation, existsCountDays) => {
    let price = 0;
    if (existsCountDays > 7) { }
    else if (existsCountDays <= 7 && existsCountDays > 3) {
        price = (reservation?.totalCost * 15) / 100;
    }
    else if (existsCountDays <= 3 && existsCountDays >= 0) {
        price = (reservation?.totalCost * 30) / 100;
    }
    return price;
}

export const guestCancelPriceCalculateAfterCheckIn = async (reservation, existsCountDays) => {
    let basePrice = 0, stayedDays = [];
    for (let index = 0; index < existsCountDays; index++) {
        const element = reservation?.dates[index];
        basePrice += element.price;
        stayedDays.push(element);
    }
    const calculatedPrice = reservation?.totalCost - basePrice;
    let guestPrice = ((calculatedPrice > 0 ? calculatedPrice : 0) * 40) / 100;
    return {
        guestPrice,
        hostPrice: basePrice,
        stayedDays
    }
}

export const hostCancelPriceCalculateAfterCheckIn = async (reservation, existsCountDays) => {
    let stayedPrice = 0, stayedDays = [], guestPrice = 0;
    const discount = reservation?.totalDiscount / (reservation?.dates?.length || 1);
    for (let index = 0; index < existsCountDays; index++) {
        const element = reservation?.dates[index];
        stayedPrice += (element.price - discount);
        stayedDays.push(element);
    }
    for (let index = existsCountDays; index < reservation?.dates?.length; index++) {
        const element = reservation?.dates[index];
        guestPrice += (element.price - discount);
    }
    const hostFine =  ((guestPrice > 0 ? guestPrice : 0) * 40) / 100;
    return {
        guestPrice,
        stayedDays,
        hostFine,
        stayedPrice
    }
}