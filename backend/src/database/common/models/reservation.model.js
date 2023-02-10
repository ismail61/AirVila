import mongoose from 'mongoose';
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
        enum: ['Requested', 'Accepted', 'Declined', 'Completed', 'Cancelled'],
        default: 'Requested'
    },
    cancelledReason: String,
    payment: {
        status: {
            type: String,
            enum: ['Pending', 'Confirmed', 'Failed'],
            default: 'Pending'
        },
        customerInfo: {
            name: String,
            email: String,
            phone: String,
            address: String,
        },
        info: {
            total_amount: Number,
            tran_id: String,
            currency: String,
            emi_option: String,
        }
    },
    requestedPendingDate: {
        type: Date,
        default: Date.now,
    },
    dates: [{
        date: Date,
        price: Number,
    }],
    cancelledDates: [{
        date: Date,
        price: Number,
    }],
    requestedAcceptedDate: Date,
    paymentConfirmedDate: Date,
    reservationCompletedDate: Date,
    reservationCancelledDate: Date,
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
            adult: Number,
            child: Number
        },
        pets: Number,
        cars: Number,
        title: StringRequired,
        photo: StringRequired,
    },
    price: {
        cleaningFee: Number,
        carParkingFee: Number,
        additionalGuestRent: Number,
        additionalPetsRent: Number,
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
    commission: Number,
    totalBasePrice: NumberRequired,
    daysDiscount: Number,
    totalDiscount: Number,
    totalDiscount: Number,
    totalCost: NumberRequired, // without commission & gift price
    totalUtilityPrice: Number,
    giftDiscount: Number,
    discountCode: String,
    voucherDiscount: Number,
    giftDiscount: Number,
    grandTotal: NumberRequired,
    daysDiscount: {
        type: String,
        amount: Number
    }
}, { timestamps: true });

export default mongoose.model('Reservation', reservationSchema);