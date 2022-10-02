import mongoose from 'mongoose';
import { NumberRequired } from '../../type/numberRequired';

const walletSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    userType: {
        type: String,
        enum: ['guest', 'host'],
        default: 'guest',
    },
    transactions: [
        {
            reservationId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Reservation',
                index: true,
            },
            amount: NumberRequired,
            time: {
                type: Date,
                default: new Date(),
            },
            paid: {
                type: Boolean,
                default: false,
            },
            transactionType: String,
            cause: String,
        }
    ],
}, {
    timestamps: true
})

export default mongoose.model('Wallet', walletSchema);