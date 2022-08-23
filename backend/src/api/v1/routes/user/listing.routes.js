import { listingController } from "../../controllers/user";
import { userAuthentication } from "../../middlewares/user";
import { tryCatchHandle } from "../../utils";

function listingRoutes(app) {
    // Host
    app.post('/create-listing', userAuthentication, tryCatchHandle(listingController().createListing));
    app.patch('/update-listing/:id', userAuthentication, tryCatchHandle(listingController().updateListing));
    app.get('/host/get-listing', userAuthentication, tryCatchHandle(listingController().getHostListing));
    app.get('/host/get-single-listing', userAuthentication, tryCatchHandle(listingController().getHostSingleListing));
    app.patch('/host/listing/coupon-code-add/:listingId', userAuthentication, tryCatchHandle(listingController().couponCodeAdd));
    app.patch('/host/listing/coupon-code-remove/:listingId/:couponId', userAuthentication, tryCatchHandle(listingController().couponCodeRemove));
    app.post('/host/listing/coupon-code-applied/:listingId/', userAuthentication, tryCatchHandle(listingController().couponCodeApplied));

    // Guest
    app.get('/guest/get-home-page-listing', userAuthentication, tryCatchHandle(listingController().getGuestListing));
    app.get('/guest/get-listing/:id', userAuthentication, tryCatchHandle(listingController().getGuestSingleListing));
}
export { listingRoutes };