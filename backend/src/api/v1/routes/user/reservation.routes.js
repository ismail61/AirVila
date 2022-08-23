import { reservationController } from "../../controllers/user";
import { userAuthentication } from "../../middlewares/user";
import { tryCatchHandle } from "../../utils";

function reservationRoutes(app) {
    // Host
    app.patch('/host/accepted-reservation/:reservationId', userAuthentication, tryCatchHandle(reservationController().requestReservationAcceptedByHost));
    app.patch('/host/declined-reservation/:reservationId', userAuthentication, tryCatchHandle(reservationController().requestReservationDeclinedByHost));
    app.get('/host/get-reservation/:reservationId', userAuthentication, tryCatchHandle(reservationController().getHostSingleReservation));
    app.get('/host/get-reservations', userAuthentication, tryCatchHandle(reservationController().getHostReservations));

    // Guest
    app.post('/guest/request-reservation', userAuthentication, tryCatchHandle(reservationController().requestReservation));
    app.patch('/guest/accepted-reservation/:reservationId', userAuthentication, tryCatchHandle(reservationController().requestReservationAcceptedByGuest));
    app.patch('/guest/declined-reservation/:reservationId', userAuthentication, tryCatchHandle(reservationController().requestReservationDeclinedByGuest));
    app.patch('/guest/payment-reservation/:reservationId', userAuthentication, tryCatchHandle(reservationController().paymentReservation));
    app.get('/guest/get-reservation/:reservationId', userAuthentication, tryCatchHandle(reservationController().getGuestSingleReservation));
    app.get('/guest/get-reservations', userAuthentication, tryCatchHandle(reservationController().getGuestReservations));
}
export { reservationRoutes };