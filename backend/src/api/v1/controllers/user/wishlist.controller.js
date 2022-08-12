import { getWishlist, createWishlist, addItemInWishlist, deleteWishlistById, WishlistItemDelete } from "../../services/user";
import { error } from "../../utils";
import { wishlistItemValidation } from "../../validations";

function wishlistController() {
    return {
        addToWishlist: async (req, res) => {
            const item = { ...req.body };

            // Validation
            const validation = wishlistItemValidation(item);
            if (validation.error) return error().resourceError(res, validation.error?.details[0].message, 422);

            //check existing wishlist
            const isExistWishlist = await getWishlist({ userId: req.user?._id });
            if (!isExistWishlist) {
                const wishlist = await createWishlist({ userId: req.user?._id, items: [item] });
                return res.status(201).json(wishlist);
            }

            //check existing wishlist listing
            const isExistItem = await getWishlist({
                userId: req.user?._id,
                'items.listingId': item.listingId
            });
            if (isExistItem) return error().resourceError(res, 'Already added in Wishlist', 404);

            const wishlist = await addItemInWishlist({ userId: req.user?._id }, { items: item });
            return res.status(200).json(wishlist);
        },

        getWishlist: async (req, res) => {
            const wishlist = await getWishlist({ userId: req.user?._id });
            if (!wishlist) return error().resourceError(res, 'Wishlist Not Found', 404);
            return res.status(200).json(wishlist);
        },

        deleteWishlist: async (req, res) => {
            const { wishlistId } = req.params;
            const wishlist = await deleteWishlistById(wishlistId);
            if (!wishlist) return error().resourceError(res, 'Wishlist Deleted Failed', 404);
            return res.status(200).json(wishlist);
        },

        deleteWishlistItem: async (req, res) => {
            const { listingId } = req.params;
            const wishlist = await WishlistItemDelete({ userId: req.user?._id }, { items: { listingId } });
            if (!wishlist) return error().resourceError(res, 'Wishlist Item Deleted Failed', 404);
            return res.status(200).json(wishlist);
        },
    }
}
export { wishlistController };