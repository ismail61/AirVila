import mongoose from 'mongoose';
import { NumberRequired } from '../../type/numberRequired';

const TransactionFeeSchema = mongoose.Schema({
    percentage: NumberRequired,
}, {
    timestamps: true
})

export default mongoose.model('TransactionFee', TransactionFeeSchema);