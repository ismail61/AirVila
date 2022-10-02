import { NumberRequired } from "../../type/numberRequired";
import mongoose from "mongoose";

const wishListSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [{
        listingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Listing',
            required: true
        },
        guestsCapacity: NumberRequired,
        petsCapacity: Number,
        _id: false
    }]
})

wishListSchema.index({ userId: 1, 'items.listingId': 1 })

export default mongoose.model("Wishlist", wishListSchema);