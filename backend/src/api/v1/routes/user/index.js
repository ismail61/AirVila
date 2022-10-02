import { accountRoutes } from './account.routes';
import { authRoutes } from './auth.routes';
import { guestChatRoutes } from './chat.routes';
import { commissionRoutes } from './commission.routes';
import { listingRoutes } from './listing.routes';
import { reservationRoutes } from './reservation.routes';
import { transactionFeeRoutes } from './transaction-fee.routes';
import { wishlistRoutes } from './wishlist.routes';

function UserRoutes(app) {
    authRoutes(app);
    listingRoutes(app);
    accountRoutes(app);
    wishlistRoutes(app);
    guestChatRoutes(app);
    reservationRoutes(app);
    commissionRoutes(app);
    transactionFeeRoutes(app);
}
export { UserRoutes };