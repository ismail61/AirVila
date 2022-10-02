import { reservationController } from "../../controllers/user";
import { userAuthentication } from "../../middlewares/user";
import { tryCatchHandle } from "../../utils";

function reservationRoutes(app) {
    // Host
    app.patch('/host/request-accepted-reservation/:reservationId', userAuthentication, tryCatchHandle(reservationController().requestReservationAcceptedByHost));
    app.patch('/host/request-declined-reservation/:reservationId', userAuthentication, tryCatchHandle(reservationController().requestReservationDeclinedByHost));
    app.get('/host/get-reservation/:reservationId', userAuthentication, tryCatchHandle(reservationController().getHostSingleReservation));
    app.get('/host/get-reservations', userAuthentication, tryCatchHandle(reservationController().getHostReservations));
    app.patch('/host/cancel-reservation/:reservationId', userAuthentication, tryCatchHandle(reservationController().cancelReservationByHost));

    // Guest
    app.post('/guest/request-reservation', userAuthentication, tryCatchHandle(reservationController().requestReservation));
    app.get('/guest/get-reservation/:reservationId', userAuthentication, tryCatchHandle(reservationController().getGuestSingleReservation));
    app.get('/guest/get-reservations', userAuthentication, tryCatchHandle(reservationController().getGuestReservations));
    app.patch('/guest/payment-reservation/:reservationId', userAuthentication, tryCatchHandle(reservationController().paymentReservation));
    app.patch('/guest/cancel-reservation/:reservationId', userAuthentication, tryCatchHandle(reservationController().cancelReservationByGuest));
}
export { reservationRoutes };