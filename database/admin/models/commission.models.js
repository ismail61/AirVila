import mongoose from 'mongoose';
import { NumberRequired } from '../../type/numberRequired';

const commissionSchema = mongoose.Schema({
    percentage: NumberRequired,
    type: {
        type: String,
        enum: ['guest', 'host'],
        default: 'guest',
    }
}, {
    timestamps: true
})

export default mongoose.model('Commission', commissionSchema);