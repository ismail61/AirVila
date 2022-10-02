import { transactionFeeController } from '../../controllers/admin';
import { tryCatchHandle } from '../../utils';

function transactionFeeRoutes(app) {
    app.get('/transactionFee', tryCatchHandle(transactionFeeController().getTransactionFee));
}
export { transactionFeeRoutes };