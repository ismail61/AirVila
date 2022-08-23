import { listingController } from "../../controllers/admin";
import { tryCatchHandle } from "../../utils";

function adminListingRoutes(app) {
    app.patch('/admin/AIR@123/listed-listing/:listingId', tryCatchHandle(listingController().listedListing));
    app.patch('/admin/AIR@123/un-listed-listing/:listingId', tryCatchHandle(listingController().unListedListing));
}
export { adminListingRoutes };