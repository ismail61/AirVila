import { adminChatRoutes } from "./chat.routes";
import { adminListingRoutes } from "./listing.routes";
import { adminUsersControlRoutes } from "./users.routing";

function AdminRoutes(app) {
    adminListingRoutes(app);
    adminUsersControlRoutes(app);
    adminChatRoutes(app);
}
export { AdminRoutes };