import mongoose from "mongoose";
import { StringRequired } from '../../type/stringRequired';
import { NumberRequired } from '../../type/numberRequired';

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
    image: String,
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
    hostRating: [{
        cleanliness: NumberRequired,
        Communication: NumberRequired,
        RespectToHouseRules: NumberRequired,
        respectToOthersOrServants: NumberRequired,
        timelyCheckOut: NumberRequired,
        maintainingPropertyCare: NumberRequired,
        avg: NumberRequired,
        message: StringRequired,
        hostID: StringRequired
    }],
    rating: {
        cleanliness: Number,
        Communication: Number,
        RespectToHouseRules: Number,
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
}, { timestamps: true });

userSchema.index({ id: 1, identityNumber: 1, active: 1, email: 1, phone: 1 })
export default mongoose.model("User", userSchema);