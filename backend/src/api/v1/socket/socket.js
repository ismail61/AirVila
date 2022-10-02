function socketImplementation(eventEmitter, io) {
    let reservations = [];
    let hosts = [];
    let guests = [];
    const addReservation = (reservationId, socketId) => {
        !reservations?.some((reservation) => reservation.reservationId === reservationId) &&
            reservations?.push({ reservationId, socketId });
    };
    const addHost = (hostId, socketId) => {
        !hosts?.some((host) => host.hostId === hostId) &&
            hosts?.push({ hostId, socketId });
    };
    const addGuest = (guestId, socketId) => {
        !guests?.some((guest) => guest.guestId === guestId) &&
            guests?.push({ guestId, socketId });
    };
    const removeReservation = (socketId) => {
        reservations = reservations?.filter((reservation) => reservation.socketId !== socketId);
    };
    const removeHost = (socketId) => {
        hosts = hosts?.filter((host) => host.socketId !== socketId);
    };
    const removeGuest = (socketId) => {
        guests = guests?.filter((guest) => guest.socketId !== socketId);
    };
    const getReservation = (reservationId) => {
        return reservations?.find((reservation) => reservation.reservationId == reservationId);
    };
    const getHost = (hostId) => {
        return hosts?.find((host) => host.hostId == hostId);
    };
    const getGuest = (guestId) => {
        return guests?.find((guest) => guest.guestId == guestId);
    };

    io.on('connection', (socket) => {

        socket.on('addReservation', (reservationId) => {
            if (reservationId) {
                addReservation(reservationId, socket.id);
                io.emit('getReservations', reservations);
            }
        });

        socket.on('addHost', (hostId) => {
            if (hostId) {
                addHost(hostId, socket.id);
                io.emit('getHosts', hosts);
            }
        });

        socket.on('addGuest', (guestId) => {
            if (guestId) {
                addGuest(guestId, socket.id);
                io.emit('getGuests', guests);
            }
        });

        socket.on('disconnect', () => {
            removeReservation(socket.id);
            removeHost(socket.id);
            removeGuest(socket.id)
            io.emit('getReservations', reservations);
        });
    });

    // reservation
    eventEmitter.on('reservationRequested', (data) => {
        let host = getHost(data.hostId);
        io.to(host?.socketId).emit('reservationRequested', data);
    });

    eventEmitter.on('reservationAccepted', (data) => {
        let guest = getGuest(data.guestId);
        io.to(guest?.socketId).emit('reservationAccepted', data);
    });

    eventEmitter.on('reservationDeclined', (data) => {
        let guest = getGuest(data.guestId);
        io.to(guest?.socketId).emit('reservationDeclined', data);
    });

    eventEmitter.on('reservationPaymentConfirmed', (data) => {
        let host = getHost(data.hostId);
        io.to(host?.socketId).emit('reservationPaymentConfirmed', data);
    });

    eventEmitter.on('reservationCancelled', (data) => {
        let host = getHost(data.hostId);
        io.to(host?.socketId).emit('reservationCancelled', data);
    });

    // eventEmitter.on('reservationReturned', (data) => {
    //     let reservation = getReservation(data.reservationId);
    //     io.to(reservation?.socketId).emit('reservationReturned', data);
    // });

    // admin message
    eventEmitter.on('admin-new-message', (data) => {
        io.emit('admin-new-message', data);
    });

    // host message 
    eventEmitter.on('host-new-message-form-guest', (data) => {
        let host = getHost(data.hostId);
        io.to(host?.socketId).emit('host-new-message-form-guest', data);
    });

    eventEmitter.on('host-new-message-form-admin', (data) => {
        let host = getHost(data.hostId);
        io.to(host?.socketId).emit('host-new-message-form-admin', data);
    });

    // guest message
    eventEmitter.on('guest-new-message-from-host', (data) => {
        let guest = getGuest(data.guestId);
        io.to(guest?.socketId).emit('guest-new-message-from-host', data);
    });

    eventEmitter.on('guest-new-message-form-admin', (data) => {
        let guest = getGuest(data.guestId);
        io.to(guest?.socketId).emit('guest-new-message-form-admin', data);
    });
}
export default socketImplementation;
