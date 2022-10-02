import { transactionFeeController } from '../../controllers/admin';
import { tryCatchHandle } from '../../utils';

function transactionFeeRoutes(app) {
    app.post('/admin/AIR@123/add-transactionFee', tryCatchHandle(transactionFeeController().addTransactionFee));
    app.get('/admin/AIR@123/transactionFee', tryCatchHandle(transactionFeeController().getTransactionFee));
    app.patch('/admin/AIR@123/transactionFee/:transactionFeeId', tryCatchHandle(transactionFeeController().updateTransactionFee));
}
export { transactionFeeRoutes };