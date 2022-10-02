import mongoose from 'mongoose';
import { NumberRequired } from '../../type/numberRequired';

const reviewSchema = mongoose.Schema({
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        required: true,
        index: true,
    },
    hostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    reservationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation',
        required: true,
        index: true
    },
    guestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    reply: String,
    // common
    cleanliness: NumberRequired,

    // guest
    behavior: Number,
    accuracyOrCommitment: Number,
    Location: Number,
    Value: Number,
    flexibleCheckIn: Number,

    // host
    communication: Number,
    respectToHouseRules: Number,
    respectToOthersOrServants: Number,
    timelyCheckOut: Number,
    maintainingPropertyCare: Number,
}, {
    timestamps: true
});

reviewSchema.index({ listingId: 1, hostId: 1, reservationId: 1, guestId: 1 });
export default mongoose.model('Review', reviewSchema);