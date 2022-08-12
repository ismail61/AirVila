import { wishlistController } from "../../controllers/user";
import { userAuthentication } from "../../middlewares/user";
import { tryCatchHandle } from "../../utils";

function wishlistRoutes(app) {
    app.post('/guest/add-wishlist', userAuthentication, tryCatchHandle(wishlistController().addToWishlist));
    app.get('/guest/get-wishlist', userAuthentication, tryCatchHandle(wishlistController().getWishlist));
    app.delete('/guest/delete-wishlist/:wishlistId', userAuthentication, tryCatchHandle(wishlistController().deleteWishlist));
    app.delete('/guest/delete-wishlist-item/:listingId', userAuthentication, tryCatchHandle(wishlistController().deleteWishlistItem));
}
export { wishlistRoutes };