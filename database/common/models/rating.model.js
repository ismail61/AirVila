import mongoose from "mongoose";
import { NumberRequired } from "../../type/numberRequired";
import { StringRequired } from "../../type/stringRequired";

const reviewSchema = mongoose.Schema({
    guestId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true,
    },
    hostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        index: true
    },
    reservationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Reservation',
        index: true
    },
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Listing',
        index: true
    },

    // common
    cleanliness: NumberRequired,

    // Guest Rating For Host
    behavior: Number,
    accuracyOrCommitment: Number,
    location: Number,
    value: Number,
    flexibleCheckIn: Number,

    // Host Rating For Guest
    communication: Number,
    respectToHouseRules: Number,
    respectToOthersOrServants: Number,
    timelyCheckOut: Number,
    maintainingPropertyCare: Number,

    avg: NumberRequired,
    message: StringRequired,
}, {
    timestamps: true
})

reviewSchema.index({ reservationId: 1, guestId: 1, hostId: 1, listingId: 1, avg: 1 });
export default mongoose.model('Review', reviewSchema);