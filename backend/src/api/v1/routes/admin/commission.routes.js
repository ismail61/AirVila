import { commissionController } from '../../controllers/admin';
import { tryCatchHandle } from '../../utils';

function commissionRoutes(app) {
    app.post('/admin/AIR@123/add-commission', tryCatchHandle(commissionController().addCommission));
    app.get('/admin/AIR@123/commissions', tryCatchHandle(commissionController().getCommissions));
    app.get('/admin/AIR@123/commissions/:commissionId', tryCatchHandle(commissionController().getCommission));
    app.patch('/admin/AIR@123/commission/:commissionId', tryCatchHandle(commissionController().updateCommission));
}
export { commissionRoutes };