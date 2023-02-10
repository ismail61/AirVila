import mongoose from 'mongoose';
import { NumberRequired } from '../../type/numberRequired';
import { StringRequired } from '../../type/stringRequired';

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
    message: StringRequired,
    replyMessage: String,
    replied: {
        type: Boolean,
        default: false
    },
    guestRating: {
        cleanliness: NumberRequired,
        behavior: Number,
        accuracyOrCommitment: Number,
        location: Number,
        value: Number,
        flexibleCheckIn: Number,
        avgRating: NumberRequired
    },
    hostRating: {
        cleanliness: NumberRequired,
        communication: Number,
        respectToHouseRules: Number,
        respectToOthersOrServants: Number,
        timelyCheckOut: Number,
        maintainingPropertyCare: Number,
        avgRating: NumberRequired
    }
}, {
    timestamps: true
});

reviewSchema.index({ listingId: 1, hostId: 1, reservationId: 1, guestId: 1 });
export default mongoose.model('Review', reviewSchema);