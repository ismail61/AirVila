import mongoose from 'mongoose';
import { StringRequired } from '../../type/stringRequired';

const userSchema = new mongoose.Schema({
    id: {
        ...StringRequired,
        unique: true,
        index: true
    },
    firstName: StringRequired,
    lastName: StringRequired,
    nickName: String,
    email: {
        ...StringRequired,
        lowercase: true,
        trim: true,
        unique: true,
        index: true,
    },
    identityType: {
        ...StringRequired,
        enum: ['NID', 'PASSPORT', 'DRIVING_LICENSE', 'BIRTH_CERTIFICATE']
    },
    identityNumber: {
        ...StringRequired,
        trim: true,
        unique: true,
        index: true,
    },
    phone: {
        ...StringRequired,
        trim: true,
        unique: true,
        index: true,
    },
    aboutMe: String,
    profession: String,
    organization: String,
    languages: [String],
    image: {
        url: String,
        publicId: String
    },
    password: {
        ...StringRequired,
        unique: true,
        index: true,
        trim: true,
    },
    active: {
        type: Boolean,
        default: false,
        index: true
    },
    resetPasswordToken: String,
    resetPasswordTokenDate: Date,
    rating: {
        cleanliness: Number,
        communication: Number,
        respectToHouseRules: Number,
        respectToOthersOrServants: Number,
        timelyCheckOut: Number,
        maintainingPropertyCare: Number,
        avg: Number,
    },
    rewards: {
        type: Number,
        default: 0
    },
    gender: String,
    updateRequest: {
        firstName: String,
        lastName: String,
        gender: String,
        phone: String,
        identityNumber: String
    },
    orderedHost: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                index: true,
            }
        }
    ],
    giftDiscount: {
        percentage: Number,
        validity: Date,
        maxDiscountPrice: Number
    }
}, { timestamps: true });

userSchema.index({ id: 1, identityNumber: 1, active: 1, email: 1, phone: 1 })
export default mongoose.model('User', userSchema);