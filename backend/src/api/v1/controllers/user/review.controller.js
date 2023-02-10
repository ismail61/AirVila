import {
    replyVendorReview,
    getVendorReview,
    findReservation,
    addGuestReview,
} from '../../services/user';
import { error, objectValidatorEscape } from '../../utils';
import { guestReviewValidation } from '../../validations';

const reviewController = () => {
    return {

        // make a review by guest
        addReview: async (req, res) => {
            const validation = guestReviewValidation(req.body);
            if (validation.error) return error().resourceError(res, validation.error?.details[0].message, 422);

            const { reservationId } = req.body;

            // check existing reservation
            const reservation = await findReservation({
                id: reservationId,
                guestId: req.user?._id,
            });
            if (!reservation) return error().resourceError(res, 'Sorry! This Reservation doest not exists', 422);
            if (reservation.status !== 'Completed') return error().resourceError(res, 'Sorry! You can not review this reservation right now', 422);

            let completedDate = new Date(reservation?.reservationCompletedDate);
            completedDate.setDate(completedDate.getDate + 10);
            if (completedDate < new Date()) return error().resourceError(res, 'Sorry! Review Time is Over', 422);

            const review = await addGuestReview(req.body);
            return res.status(200).json(review);
        },

        // extend review by host
        extendReview: async (req, res) => {
            const { review_id } = req.params;

            const refactor_data = objectValidatorEscape(req.body);

            const repliedReview = await replyVendorReview({ $and: [{ _id: review_id }, { vendor_id: req.user?._id }] }, {
                ...refactor_data,
            });
            return res.status(200).json(repliedReview);
        },

        getReviews: async (req, res) => {
            const reviewsArray = await getVendorReview({ _id: req.user?._id });
            return res.status(200).json(reviewsArray?.reviews);
        },
    }
}

export { reviewController }