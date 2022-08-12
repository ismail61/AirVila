import { updateListing } from "../../services/user";
import { error } from "../../utils";

function listingController() {
    return {
        listedListing: async (req, res) => {
            const { listingId } = req.params;
            const listing = await updateListing({ _id: listingId }, { status: 'Listed' });
            if (!listing) return error().resourceError(res, 'Listing Updated Failed!', 404);
            return res.status(200).json(listing);
        },

        unListedListing: async (req, res) => {
            const { listingId } = req.params;
            const listing = await updateListing({ _id: listingId }, { status: 'Unlisted' });
            if (!listing) return error().resourceError(res, 'Listing Updated Failed!', 404);
            return res.status(200).json(listing);
        },
    }
}
export { listingController };