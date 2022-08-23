import { couponCodeAddedListing, couponCodeRemoveListing, createListing, findAllHomeListing, findAllListing, findListing, generateSearchQuery, updateListing } from "../../services/user";
import { error, generateRandomId } from "../../utils"
import { createListingValidation, updateListingValidation } from "../../validations";
const Regex = /^[-\w\s]+$/;

function listingController() {
    return {

        // Host
        createListing: async (req, res) => {
            // De-Structure data from req.body
            const { title } = req.body;
            if (!Regex.test(title)) return error().resourceError(res, 'You can not use special characters', 422);

            // Validate all information
            const validation = createListingValidation(req.body);
            if (validation.error) return error().resourceError(res, validation.error?.details[0].message, 422);

            //find a listing is assigned to the same title
            const doesTitleMatch = await findListing({ title });
            if (doesTitleMatch) return error().resourceError(res, 'Title already exists. Please choose a different Title', 409);

            // Generate 6 digit random number
            const id = await generateRandomId();

            // save into mongo db
            const createdListing = await createListing({
                id: `P${id}`,
                userId: req.user._id,
                ...req.body
            }, res);
            if (!createdListing) return error().resourceError(res, 'Listing Added Failed!', 404);
            return res.status(201).json({ message: 'Listing Added Successful' });
        },

        updateListing: async (req, res) => {
            const { id } = req.params;

            // De-Structure data from req.body
            const { title } = req.body;
            if (!Regex.test(title)) return error().resourceError(res, 'You can not use special characters', 422);

            // Validate all information
            const validation = updateListingValidation(req.body);
            if (validation.error) return error().resourceError(res, validation.error?.details[0].message, 422);

            //find a listing is assigned to the same title
            const doesTitleMatch = await findListing({ title, id: { $ne: id } });
            if (doesTitleMatch) return error().resourceError(res, 'Title already exists. Please choose a different Title', 409);

            // update listing
            const updatedListing = await updateListing({ id }, req.body);
            if (!updatedListing) return error().resourceError(res, 'Listing Updated Failed!', 404);

            // Review request of Listing
            if (req?.query?.photos === 'true' || req?.query?.address === 'true') await updateListing({ id }, { status: 'On Process' });
            return res.status(200).json({ message: 'Listing Updated Successful' });
        },

        getHostListing: async (req, res) => {
            const { _id } = req.user;
            const { skip, limit } = req.params;
            //find all listing
            const listing = await findAllListing({ userId: _id }, skip, limit);
            return res.status(200).json(listing);
        },

        getHostSingleListing: async (req, res) => {
            const { title } = req.body;
            const query = { title };
            //find a listing
            const listing = await findListing(query);
            if (!listing) return error().resourceError(res, 'Listing Not Found!', 404);
            return res.status(200).json({ message: 'Already Have a Listing' });
        },

        couponCodeAdd: async (req, res) => {
            const { listingId } = req.params;
            const { code, discount, discountType } = req.body;

            if (!discountType) return error().resourceError(res, 'Discount Type is Required', 422);
            if (!code || !discount) return error().resourceError(res, 'Coupon Code or Discount Amount/Percentage is Required', 422);

            //find a listing which code is already exists
            const doesCodeExists = await findListing({
                id: listingId,
                'coupons.code': code
            });
            if (doesCodeExists) return error().resourceError(res, 'This Code is already exists in your coupons', 404);

            // coupon code added in listing
            const listing = await couponCodeAddedListing({ id: listingId }, req.body);
            return res.status(200).json(listing);
        },

        couponCodeRemove: async (req, res) => {
            const { listingId, couponId } = req.params;
            // coupon code removed from listing
            const listing = await couponCodeRemoveListing({ id: listingId }, couponId);
            return res.status(200).json(listing);
        },

        couponCodeApplied: async (req, res) => {
            const { listingId, } = req.params;
            const { code } = req.body;
            if (!code) return error().resourceError(res, 'Coupon Code is Required!', 422);

            // find valid code
            const listing = await findListing({
                id: listingId,
                'coupons.code': code
            });
            if (!listing) return error().resourceError(res, 'Coupon Code is Invalid!', 422);
            let couponResult = null;
            listing.coupons?.forEach(coupon => {
                if (coupon.code === code) {
                    couponResult = coupon;
                }
            })
            return res.status(200).json(couponResult);
        },


        // Guest
        getGuestListing: async (req, res) => {
            const { skip, limit, } = req.query;
            const query = generateSearchQuery(req.query);
            //find all listing
            const listing = await findAllHomeListing({
                ...query,
                status: 'Listed'
            }, skip, limit);
            return res.status(200).json(listing);
        },

        getGuestSingleListing: async (req, res) => {
            const { id } = req.params;
            //find a listing
            const listing = await findListing({ id });
            if (!listing) return error().resourceError(res, 'Listing Not Found!', 404);
            return res.status(200).json(listing);
        },
    }
}
export { listingController };