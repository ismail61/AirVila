import { accountRoutes } from "./account.routes";
import { authRoutes } from "./auth.routes";
import { guestChatRoutes } from "./chat.routes";
import { listingRoutes } from "./listing.routes";
import { wishlistRoutes } from "./wishlist.routes";

function UserRoutes(app) {
    authRoutes(app);
    listingRoutes(app);
    accountRoutes(app);
    wishlistRoutes(app);
    guestChatRoutes(app);
}
export { UserRoutes };