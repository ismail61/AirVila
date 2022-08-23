import mongoose from "mongoose";
import { StringRequired } from '../../type/stringRequired';
import { NumberRequired } from '../../type/numberRequired';

const reservationSchema = new mongoose.Schema({
    id: {
        ...StringRequired,
        unique: true,
        index: true
    },
    status: {
        type: String,
        enum: ['Requested', 'Accepted', 'Declined', 'Completed'],
        default: 'Requested'
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Confirmed', 'Failed'],
        default: 'Pending'
    },
    requestedPendingDate: {
        type: Date,
        default: Date.now,
    },
    requestedAcceptedDate: Date,
    paymentConfirmedDate: Date,
    reservationCompletedDate: Date,
    info: {
        checkInTime: {
            type: Date,
            required: true
        },
        checkOutTime: {
            type: Date,
            required: true
        },
        guests: {
            adult: NumberRequired,
            child: Number
        },
        pets: Number,
        cars: Number,
        title: StringRequired,
        photo: StringRequired,
    },
    discountCode: String,
    voucherDiscountAmount: Number,
    price: {
        base: NumberRequired,
        cleaningFee: Number,
        carParkingFee: Number,
        additionalGuestRent: Number,
        additionalPetsRent: Number,
        serviceFee: NumberRequired,
        totalCost: NumberRequired
    },
    hostId: {
        ...StringRequired,
        index: true
    },
    guestId: {
        ...StringRequired,
        index: true
    },
    listingId: {
        ...StringRequired,
        index: true
    },
}, { timestamps: true });

export default mongoose.model("Reservation", reservationSchema);