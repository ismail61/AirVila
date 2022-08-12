import { listingController } from "../../controllers/admin";
import { tryCatchHandle } from "../../utils";

function adminListingRoutes(app) {
    app.patch('/listed-listing/:listingId', tryCatchHandle(listingController().listedListing));
    app.patch('/un-listed-listing/:listingId', tryCatchHandle(listingController().unListedListing));
}
export { adminListingRoutes };