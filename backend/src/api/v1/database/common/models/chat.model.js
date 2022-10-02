import mongoose from "mongoose";
import { StringRequired } from "../../type/stringRequired";

const chatSchema = mongoose.Schema({
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
    messages: [
        {
            sender: {
                type: String,
                enum: ['guest', 'host', 'admin', 'neural'],
                default: 'admin',
            },
            text: StringRequired,
            time: {
                type: Date,
                default: new Date()
            },
            _id: false
        }
    ],
    admin: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

chatSchema.index({ admin: 1, guestId: 1, hostId: 1 });
export default mongoose.model('Chat', chatSchema);