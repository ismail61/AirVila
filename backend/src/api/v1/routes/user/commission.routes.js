import { commissionController } from '../../controllers/admin';
import { tryCatchHandle } from '../../utils';

function commissionRoutes(app) {
    app.get('/guest/commission', tryCatchHandle(commissionController().getGuestCommission));
    app.get('/host/commission', tryCatchHandle(commissionController().getHostCommission));
}
export { commissionRoutes };