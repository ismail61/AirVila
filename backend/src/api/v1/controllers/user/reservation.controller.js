import {
    findAllHomeListing,
    findListing,
    generateSearchQuery,
} from "../../services/user";
import { error, generateRandomId } from "../../utils"
import {
    requestReservationValidation,
} from "../../validations";

function reservationController() {
    return {

        // Guest
        requestReservation: async (req, res) => {
            // De-Structure data from req.body
            const { listingId, info, price, discountCode, grandTotal } = req.body;

            // Validate all information
            const validation = requestReservationValidation(req.body);
            if (validation.error) return error().resourceError(res, validation.error?.details[0].message, 422);

            const countDays = (new Date(info.checkOutTime) - new Date(info.checkInTime)) / (1000 * 60 * 60 * 24);

            // check if the listing available
            const listing = await findListing({
                _id: listingId,
                status: 'Listed',
                'lengthOfStay.minimum': { $lte: countDays },
                'lengthOfStay.maximum': { $gte: countDays },
                'price.base': price.base,
                guestsCapacity: { $gte: (info.guest?.adult + (info.guest?.child || 0)) },
                carQuantityCapacity: { $gte: info?.cars || 0 },
            });
            if (!listing) return error().resourceError(res, 'Listing Not Found', 422);

            // Others possible validation
            if (info.pets && !listing?.pets?.allowed) return error().resourceError(res, 'Sorry! Pets Not Allowed', 422);
            if (info.checkInTime < Date.now()) return error().resourceError(res, 'Sorry! Check In Time is not Correct', 422);

            // price calculation
            let petsRent = 0, carsRent = 0, totalDiscount = 0;

            if (info.pets) {
                petsRent += (info.pets * listing?.pets?.additionalPetsRent || 0);
            }

            if (info.cars) {
                carsRent += (info.cars * listing.price?.carParkingFee || 0);
            }

            if (countDays) {
                if (countDays >= 3 && countDays < 7) {
                    totalDiscount = (((listing?.price?.base * countDays) * (listing?.discount?.threeDays || 0)) / 100);
                } else if (countDays >= 7 && countDays < 30) {
                    totalDiscount = (((listing?.price?.base * countDays) * (listing?.discount?.weekly || 0)) / 100);
                } else if (countDays >= 30) {
                    totalDiscount = (((listing?.price?.base * countDays) * (listing?.discount?.monthly || 0)) / 100);
                }
            }


            const totalRent = (listing?.price?.base * countDays) + petsRent + carsRent + price?.serviceFee + (price?.cleaningFee || 0);
            let totalCost = totalRent - totalDiscount;

            // total price check
            if (totalCost !== price.totalCost) return error().resourceError(res, 'Total Price is MisMatch!', 422);

            let voucherDiscount = 0;
            if (discountCode) {
                // find valid code
                const validCode = await findListing({
                    _id: listingId,
                    'coupons.code': discountCode
                });
                if (!validCode) return error().resourceError(res, 'Coupon Code is Invalid!', 422);
                listing.coupons?.forEach(coupon => {
                    if (coupon.code === discountCode) {
                        if (coupon.discountType === 'FLAT') {
                            voucherDiscount = coupon.discount;
                        }
                        else if (coupon.discountType === 'PERCENTAGE') {
                            voucherDiscount = (totalCost * coupon.discount) / 100;
                        }
                    }
                })
            }

            if (voucherDiscount) {
                totalCost -= voucherDiscount;
                if (totalCost < 0) totalCost = 0;
            }

            // total price check
            if (totalCost !== grandTotal) return error().resourceError(res, 'Grand Total Price is MisMatch!!!', 422);
            console.log(totalCost)

            // Generate 6 digit random number
            const id = await generateRandomId();

            // // save into mongo db
            // const createdListing = await createListing({
            //     id: `B${id}`,
            //     userId: req.user._id,
            //     ...req.body
            //  price.carParkingFee: carsRent
            //  price.additionalPetsRent: petsRent
            // }, res);
            // if (!createdListing) return error().resourceError(res, 'Listing Added Failed!', 404);
            return res.status(201).json({ message: 'Listing Added Successful' });
        },

        requestReservationAcceptedByGuest: async (req, res) => {
            const { skip, limit, } = req.query;
            const query = generateSearchQuery(req.query);
            //find all listing
            const listing = await findAllHomeListing({
                ...query,
                status: 'Listed'
            }, skip, limit);
            return res.status(200).json(listing);
        },

        requestReservationDeclinedByGuest: async (req, res) => {
            const { id } = req.params;
            //find a listing
            const listing = await findListing({ id });
            if (!listing) return error().resourceError(res, 'Listing Not Found!', 404);
            return res.status(200).json(listing);
        },

        getGuestSingleReservation: async (req, res) => {
            const { id } = req.params;
            //find a listing
            const listing = await findListing({ id });
            if (!listing) return error().resourceError(res, 'Listing Not Found!', 404);
            return res.status(200).json(listing);
        },

        getGuestReservations: async (req, res) => {
            const { id } = req.params;
            //find a listing
            const listing = await findListing({ id });
            if (!listing) return error().resourceError(res, 'Listing Not Found!', 404);
            return res.status(200).json(listing);
        },

        paymentReservation: async (req, res) => {
            const { id } = req.params;
            //find a listing
            const listing = await findListing({ id });
            if (!listing) return error().resourceError(res, 'Listing Not Found!', 404);
            return res.status(200).json(listing);
        },


        // Host
        requestReservationAcceptedByHost: async (req, res) => {
            const { skip, limit, } = req.query;
            const query = generateSearchQuery(req.query);
            //find all listing
            const listing = await findAllHomeListing({
                ...query,
                status: 'Listed'
            }, skip, limit);
            return res.status(200).json(listing);
        },

        requestReservationDeclinedByHost: async (req, res) => {
            const { id } = req.params;
            //find a listing
            const listing = await findListing({ id });
            if (!listing) return error().resourceError(res, 'Listing Not Found!', 404);
            return res.status(200).json(listing);
        },

        getHostSingleReservation: async (req, res) => {
            const { id } = req.params;
            //find a listing
            const listing = await findListing({ id });
            if (!listing) return error().resourceError(res, 'Listing Not Found!', 404);
            return res.status(200).json(listing);
        },

        getHostReservations: async (req, res) => {
            const { id } = req.params;
            //find a listing
            const listing = await findListing({ id });
            if (!listing) return error().resourceError(res, 'Listing Not Found!', 404);
            return res.status(200).json(listing);
        },
    }
}
export { reservationController };