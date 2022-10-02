import { adminChatRoutes } from "./chat.routes";
import { commissionRoutes } from "./commission.routes";
import { adminListingRoutes } from "./listing.routes";
import { transactionFeeRoutes } from "./transaction-fee.routes";
import { adminUsersControlRoutes } from "./users.routing";

function AdminRoutes(app) {
    adminListingRoutes(app);
    adminUsersControlRoutes(app);
    adminChatRoutes(app);
    commissionRoutes(app);
    transactionFeeRoutes(app);
}
export { AdminRoutes };