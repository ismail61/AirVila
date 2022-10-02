import {
    addTransactionFee,
    getTransactionFee,
    getTransactionFees,
    updateTransactionFee,
} from '../../services/admin';
import { error } from '../../utils';

function transactionFeeController() {
    return {

        // transactionFee add 
        addTransactionFee: async (req, res) => {
            const { percentage } = req.body;
            if (!percentage) return error().resourceError(res, 'TransactionFee percentage is required!', 404);

            const transactionFees = await getTransactionFees({});
            if (transactionFees.length) return error().resourceError(res, 'Transaction Fee Already Exists!', 404);

            const transactionFee = await addTransactionFee(req.body);
            if (!transactionFee) return error().resourceError(res, 'TransactionFee Added Failed!', 404);
            return res.status(200).json(transactionFee);
        },

        // transactionFee remove 
        updateTransactionFee: async (req, res) => {
            const { transactionFeeId } = req.params;

            const transactionFee = await getTransactionFee({ _id: transactionFeeId });
            if (!transactionFee) return error().resourceError(res, 'TransactionFee Not Found!', 404);

            const updatedTransactionFee = await updateTransactionFee({ _id: transactionFeeId }, req.body);
            if (!updatedTransactionFee) return error().resourceError(res, 'TransactionFee Updated Failed!', 404);
            return res.status(200).json(updatedTransactionFee);
        },

        // get transactionFee 
        getTransactionFee: async (req, res) => {
            const transactionFees = await getTransactionFees({});
            if (!transactionFees.length) return error().resourceError(res, 'TransactionFee Not Found!', 404);
            return res.status(200).json(transactionFees[0]);
        },
    }
}
export { transactionFeeController };