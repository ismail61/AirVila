import { listingController } from '../../controllers/user';
import { userAuthentication, userAuthenticationWithoutActive } from '../../middlewares/user';
import { tryCatchHandle } from '../../utils';

function listingRoutes(app) {
    // Host
    app.post('/create-listing', userAuthenticationWithoutActive, tryCatchHandle(listingController().createListing));
    app.patch('/update-listing/:listingId', userAuthenticationWithoutActive, tryCatchHandle(listingController().updateListing));
    app.get('/host/get-listing', userAuthenticationWithoutActive, tryCatchHandle(listingController().getHostListing));
    app.get('/host/get-single-listing-by-title', userAuthenticationWithoutActive, tryCatchHandle(listingController().getHostSingleListing));
    app.get('/host/get-single-listing/:listingId', userAuthenticationWithoutActive, tryCatchHandle(listingController().getHostSingleListingById));
    app.patch('/host/listing/coupon-code-add/:listingId', userAuthenticationWithoutActive, tryCatchHandle(listingController().couponCodeAdd));
    app.patch('/host/listing/coupon-code-remove/:listingId/:couponId', userAuthenticationWithoutActive, tryCatchHandle(listingController().couponCodeRemove));

    // Guest
    app.get('/guest/get-home-page-listing', tryCatchHandle(listingController().getGuestListing));
    app.get('/guest/get-listing/:listingId', tryCatchHandle(listingController().getGuestSingleListing));
    app.post('/guest/listing/coupon-code-applied/:listingId', userAuthentication, tryCatchHandle(listingController().couponCodeApplied));
}
export { listingRoutes };