import { listingController } from "../../controllers/user";
import { userAuthentication } from "../../middlewares/user";
import { tryCatchHandle } from "../../utils";

function listingRoutes(app) {
    // Host
    app.post('/create-listing', userAuthentication, tryCatchHandle(listingController().createListing));
    app.patch('/update-listing/:id', userAuthentication, tryCatchHandle(listingController().updateListing));
    app.get('/host/get-listing', userAuthentication, tryCatchHandle(listingController().getHostListing));
    app.get('/host/get-single-listing', userAuthentication, tryCatchHandle(listingController().getHostSingleListing));

    // Guest
    app.get('/guest/get-home-page-listing', userAuthentication, tryCatchHandle(listingController().getGuestListing));
    app.get('/guest/get-listing/:id', userAuthentication, tryCatchHandle(listingController().getGuestSingleListing));
}
export { listingRoutes };