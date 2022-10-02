import {
    addTransactionInWallet,
    guestCancelPriceCalculateAfterCheckIn,
    guestCancelPriceCalculateBeforeCheckIn,
    createReservation,
    findAllReservation,
    findListing,
    findReservation,
    updateReservation,
    hostCancelPriceCalculateAfterCheckIn,
    updateUser,
    findUser,
} from '../../services/user';
import { error, generateRandomId } from '../../utils'
import {
    requestReservationValidation,
} from '../../validations';
import * as schedule from 'node-schedule';
import { paymentReservationValidation } from '../../validations/user/reservation/payment.reservation.validation';
import { addMessageInChat, checkChatExist, createChat } from '../../services/common';
import { getCommission } from '../../services/admin';

function reservationController() {
    return {

        // Guest
        requestReservation: async (req, res) => {
            // De-Structure data from req.body
            const { listingId, info, price, discountCode, grandTotal, priceDates } = req.body;

            // now date check
            if (new Date(info?.checkInTime)?.getTime() <= Date.now()) {
                return error().resourceError(res, 'Check In time is Invalid', 422);
            }

            if (new Date(info?.checkOutTime)?.getTime() < new Date(info?.checkInTime)?.getTime()) {
                return error().resourceError(res, 'Check Out time is Invalid', 422);
            }

            // Validate all information
            const validation = requestReservationValidation(req.body);
            if (validation.error) return error().resourceError(res, validation.error?.details[0].message, 422);

            // const countDays = (new Date(info.checkOutTime) - new Date(info.checkInTime)) / (1000 * 60 * 60 * 24);

            // check if the listing available
            const listing = await findListing({
                _id: listingId,
                status: 'Listed',
                'lengthOfStay.minimum': { $lte: priceDates?.length },
                'lengthOfStay.maximum': { $gte: priceDates?.length },
                guestsCapacity: { $gte: (info.guest?.adult + (info.guest?.child || 0)) },
                carQuantityCapacity: { $gte: info?.cars || 0 },
            });
            if (!listing) return error().resourceError(res, 'Listing Not Found', 422);

            let priceCalculate = 0;
            priceDates?.forEach(priceAndDate => {
                priceAndDate.price = listing?.price?.base || priceAndDate?.price;
                priceCalculate += priceAndDate.price || listing?.price?.base;
                priceAndDate.date = new Date(priceAndDate.date)?.setUTCHours(0, 0, 0, 0);
                priceAndDate.date = new Date(priceAndDate.date);
            });

            // check advance days
            const countAdvancedDays = (new Date(info.checkInTime) - new Date()) / (1000 * 60 * 60 * 24);
            if (listing?.availability?.advanceNoticeBookingDays
                && listing?.availability?.advanceNoticeBookingDays > 0 &&
                listing?.availability?.advanceNoticeBookingDays > countAdvancedDays) {
                return error().resourceError(res, 'Advanced Notice days is exceed', 422);
            }

            // date available check
            let dateUnAvailable = false;
            listing?.calenders?.forEach(calender => {
                if (calender?.available === false) {
                    priceDates?.forEach(priceAndDate => {
                        if (
                            new Date(priceAndDate?.date)?.getDate() === new Date(calender?.date)?.getDate()
                            && new Date(priceAndDate?.date)?.getMonth() === new Date(calender?.date)?.getMonth()
                            && new Date(priceAndDate?.date)?.getYear() === new Date(calender?.date)?.getYear()
                        ) {
                            dateUnAvailable = true;
                        }
                    })
                } else if (calender?.available === true) {
                    priceDates?.forEach(priceAndDate => {
                        if (
                            new Date(priceAndDate?.date)?.getDate() === new Date(calender?.date)?.getDate()
                            && new Date(priceAndDate?.date)?.getMonth() === new Date(calender?.date)?.getMonth()
                            && new Date(priceAndDate?.date)?.getYear() === new Date(calender?.date)?.getYear()
                        ) {
                            priceAndDate.price = calender?.price || listing?.price?.base;
                        }
                    })
                }
            })

            if (!dateUnAvailable) {
                // Others possible validation
                if (info.pets && !listing?.pets?.allowed) return error().resourceError(res, 'Sorry! Pets Not Allowed', 422);
                if (info.checkInTime < Date.now()) return error().resourceError(res, 'Sorry! Check In Time is not Correct', 422);

                // price calculation
                let petsRent = 0, carsRent = 0, totalDiscount = 0, totalCostWithoutAdminCost = 0, daysDiscount = null;

                if (info.pets) {
                    petsRent += (info.pets * listing?.pets?.additionalPetsRent || 0);
                }

                if (info.cars) {
                    carsRent += (info.cars * listing.price?.carParkingFee || 0);
                }

                // discount price calculation
                if (priceDates?.length >= 3 && priceDates?.length < 7) {
                    totalDiscount = ((priceCalculate * (listing?.discount?.threeDays || 0)) / 100);
                    daysDiscount = {
                        type: 'THREE_DAYS',
                        amount: totalDiscount
                    }
                } else if (priceDates?.length >= 7 && priceDates?.length < 30) {
                    totalDiscount = ((priceCalculate * (listing?.discount?.weekly || 0)) / 100);
                    daysDiscount = {
                        type: 'WEEKLY',
                        amount: totalDiscount
                    }
                } else if (priceDates?.length >= 30) {
                    totalDiscount = ((priceCalculate * (listing?.discount?.monthly || 0)) / 100);
                    daysDiscount = {
                        type: 'MONTHLY',
                        amount: totalDiscount
                    }
                }

                // voucher price calculation
                let voucherDiscount = 0;
                if (discountCode) {
                    // find valid code
                    const validCode = await findListing({
                        _id: listingId,
                        'coupons.code': discountCode
                    });
                    if (!validCode) return error().resourceError(res, 'Coupon Code is Invalid!', 422);
                    listing.coupons?.forEach(coupon => {
                        if (coupon.code === discountCode) {
                            if (coupon.discountType === 'FLAT') {
                                voucherDiscount = coupon?.discount || 0;
                            }
                            else if (coupon.discountType === 'PERCENTAGE') {
                                voucherDiscount = (priceCalculate * (coupon?.discount || 0)) / 100;
                            }
                        }
                    })
                }

                // price calculate -> (((total individual days price - (days discount)) - (voucher discount)) + others utility bill(pets, cars, etc))

                const othersUtilityPrice = petsRent + carsRent + (listing?.price?.cleaningFee || 0);
                let totalCost = priceCalculate - (totalDiscount || 0);

                // total price calculate without voucher discount
                if (voucherDiscount) {
                    totalCost -= voucherDiscount;
                    totalDiscount += voucherDiscount;
                    if (totalCost < 0) totalCost = 0;
                }
                totalCostWithoutAdminCost = totalCost + othersUtilityPrice;

                // guest gift discount
                const guestGift = await findUser({
                    _id: req.user?._id,
                    giftDiscount: { $ne: null },
                    'giftDiscount.validity': { $gt: Date.now() }
                });

                let giftDiscount = 0;
                if (guestGift) {
                    giftDiscount = ((priceCalculate * (guestGift.percentage || 10)) / 100);
                    if (giftDiscount > guestGift?.maxDiscountPrice) {
                        giftDiscount = guestGift?.maxDiscountPrice
                    }
                    totalCost -= giftDiscount;
                    totalDiscount += giftDiscount;
                    if (totalCost < 0) totalCost = 0;
                }

                // add other utility price
                totalCost += othersUtilityPrice;

                // get Commission rate
                const getCommissionFee = await getCommission({ type: 'guest' });;
                const commissionFee = getCommissionFee?.percentage || 0;
                const commission = ((totalCost * commissionFee) / 100) || 0;

                // add commission fee
                totalCost += commission;

                // convert ceil value 
                totalCost = Math.ceil(totalCost);


                // total price check
                if (totalCost !== grandTotal) return error().resourceError(res, 'Grand Total Price is MisMatch!!!', 422);

                // Generate 6 digit random number
                const id = await generateRandomId();

                //assign some reservation property
                price.carParkingFee = carsRent;
                price.additionalPetsRent = petsRent;
                price.additionalGuestRent = 0;
                price.cleaningFee = listing?.price?.cleaningFee || 0;
                info.title = listing.title;
                info.photo = listing.photos?.length ? listing?.photos[0]?.url : '';
                info.checkInTime = new Date(info.checkInTime)?.setUTCHours(0, 0, 0, 1);
                info.checkOutTime = new Date(info.checkOutTime)?.setUTCHours(23, 59, 59, 999);

                // save into mongo db
                const createdReservation = await createReservation({
                    id: `B${id}`,
                    guestId: req.user._id,
                    hostId: listing.userId?._id,
                    listingId,
                    dates: priceDates,
                    voucherDiscount,
                    giftDiscount,
                    daysDiscount,
                    commission,
                    totalBasePrice: priceCalculate,
                    totalUtilityPrice: othersUtilityPrice,
                    totalDiscount,
                    totalCost: Math.ceil(totalCostWithoutAdminCost || 0),
                    ...req.body
                }, res);

                if (!createdReservation) return error().resourceError(res, 'Reservation Added Failed!', 404);

                // ordered host id insert into guest account (identify first order from the host)
                // 24 hour to check if this reservation is accepted by host
                const date = new Date(new Date(createdReservation.createdAt).getTime() + 60 * 60 * 24 * 1000);
                // const date = new Date(new Date(createdReservation.createdAt).getTime() + 2 * 60 * 1000);
                schedule.scheduleJob(`${createdReservation?._id}CREATED`, date, async function () {
                    await updateReservation({ _id: createdReservation?._id, $ne: { status: 'Accepted' } }, { status: 'Cancelled', cancelledReason: 'No Response received in 24 Hours' });
                });

                // push reservation message in guest messages
                // check existing chat
                const isExistChat = await checkChatExist({ hostId: listing.userId?._id, guestId: req.user?._id, admin: false });
                if (!isExistChat) {
                    await createChat({ messages: [{ text: 'Reservation Requested', sender: 'neural' }], guestId: req.user?._id, hostId: listing.userId?._id });
                } else {
                    await addMessageInChat(
                        { hostId: listing.userId?._id, guestId: req.user?._id, admin: false },
                        { text: 'Reservation Requested', sender: 'neural' }
                    );
                }

                const doesOrderedHostExists = await findUser({ 'orderedHost.$.id': hostId });
                if (!doesOrderedHostExists) await updateUser({ _id: req.user?._id }, { $push: { orderedHost: { id: hostId } } });
                //Event Emit for Socket IO
                const eventEmitter = req.app.get('eventEmitter');
                eventEmitter.emit('host-new-message-form-guest', { hostId: listing.userId?._id, guestId: req.user?._id });
                eventEmitter.emit('reservationRequested', { hostId: listing.userId?._id });

                return res.status(201).json({ message: 'Reservation Placed Successful' });

            } else {
                return res.status(409).json({ message: 'Few Dates Not Available' });
            }

        },

        getGuestSingleReservation: async (req, res) => {
            const { reservationId, } = req.params;
            //find a reservation
            const reservation = await findReservation({ id: reservationId, guestId: req.user?._id });
            if (!reservation) return error().resourceError(res, 'Reservation Not Found!', 404);
            if (reservation?.payment?.status === 'Confirmed') {
                return res.status(200).json(reservation);
            } else {
                const { listingId, guestId, hostId, ...rest } = reservation;
                return res.status(200).json({
                    ...rest,
                    guestId: {
                        _id: guestId._id,
                        id: guestId.id,
                        firstName: guestId.firstName,
                        createdAt: guestId.createdAt
                    },
                    hostId: {
                        _id: hostId._id,
                        id: hostId.id,
                        firstName: hostId.firstName,
                        createdAt: hostId.createdAt
                    },
                    listingId: {
                        _id: listingId._id,
                        id: listingId.id,
                        rating: listingId.rating,
                    }
                });
            }
        },

        getGuestReservations: async (req, res) => {
            const { skip, limit } = req.query;
            //find al reservations
            const reservations = await findAllReservation({ guestId: req.user?._id }, skip, limit);
            return res.status(200).json(reservations);
        },

        paymentReservation: async (req, res) => {
            const { reservationId } = req.params;
            const { payment } = req.body;

            // Validate all information
            const validation = paymentReservationValidation(req.body);
            if (validation.error) return error().resourceError(res, validation.error?.details[0].message, 422);

            // update payment of a reservation
            const reservation = await updateReservation({
                id: reservationId,
                status: 'Accepted',
                'payment.status': 'Pending',
                grandTotal: payment?.info?.total_amount,
            }, { ...req.body, paymentConfirmedDate: Date.now() });
            if (!reservation) return error().resourceError(res, 'Payment Updated Failed!', 404);

            //cancel the scheduled job
            let scheduledJob = schedule.scheduledJobs[`${reservation?._id}PAYMENT_PENDING`];
            scheduledJob && scheduledJob?.cancel();

            //check existing chat
            const isExistChat = await checkChatExist({ hostId: reservation.hostId, guestId: req.user?._id, admin: false });
            if (!isExistChat) {
                await createChat({ messages: [{ text: 'Reservation Payment Completed', sender: 'neural' }], guestId: req.user?._id, hostId: reservation.hostId });
            } else {
                await addMessageInChat(
                    { hostId: reservation.hostId, guestId: req.user?._id, admin: false },
                    { text: 'Reservation Payment Completed', sender: 'neural' }
                );
            }
            //Event Emit for Socket IO
            const eventEmitter = req.app.get('eventEmitter');
            eventEmitter.emit('host-new-message-form-guest', { hostId: reservation.hostId, guestId: req.user?._id });
            eventEmitter.emit('reservationPaymentConfirmed', { hostId: reservation.hostId });

            return res.status(200).json({ message: 'Payment Completed' });
        },

        cancelReservationByGuest: async (req, res) => {
            const { reservationId } = req.params;
            if (!req.body?.cancelledReason) return error().resourceError(res, 'CancelledReason is Required', 422);
            //find a reservation
            const reservation = await findReservation({
                id: reservationId,
                guestId: req.user?._id,
                status: { $nin: ['Completed', 'Declined', 'Cancelled'] }
            });
            if (!reservation) return error().resourceError(res, 'Reservation Not Found!', 404);


            if ((reservation.status === 'Requested' || reservation.status === 'Accepted') &&
                (reservation.payment.status === 'Pending' || reservation.payment.status === 'Failed')) {
                // cancel reservation of a reservation
                const cancelledReservation = await updateReservation({
                    id: reservationId,
                    guestId: req.user?._id,
                    status: { $nin: ['Completed', 'Declined', 'Cancelled'] }
                }, { status: 'Cancelled' });
                if (!cancelledReservation) return error().resourceError(res, 'Reservation Cancelled Failed!', 404);
            } else if ((reservation.status === 'Requested' || reservation.status === 'Accepted') && reservation.payment.status === 'Confirmed') {

                const existsCountDays = (new Date() - new Date(reservation.info.checkInTime)) / (1000 * 60 * 60 * 24);

                if (existsCountDays <= 0) {
                    const hostCalculatePriceFromGuest = await guestCancelPriceCalculateBeforeCheckIn(reservation, Math.ceil(Math.abs(existsCountDays)));

                    let guestBackPrice = (reservation?.totalCost) - (hostCalculatePriceFromGuest);

                    // Update Reservation
                    await updateReservation({
                        _id: reservation?._id,
                        guestId: req.user?._id,
                        status: { $nin: ['Completed', 'Declined', 'Cancelled'] }
                    }, {
                        cancelledDates: reservation?.dates,
                        dates: null,
                        status: 'Cancelled',
                        reservationCancelledDate: new Date(),
                        cancelledReason: req.body?.cancelledReason || 'Cancelled from the Guest Side',
                    });

                    // Guest Wallet Transactions Add
                    await addTransactionInWallet({
                        userId: req?.user?._id,
                        userType: 'guest',
                    }, {
                        reservationId: reservation?._id,
                        amount: guestBackPrice,
                        cause: 'Cancel Order By Guest',
                        transactionType: '+',
                    });

                    // Host Wallet Transactions Add
                    await addTransactionInWallet({
                        userId: reservation?.hostId,
                        userType: 'host',
                    }, {
                        reservationId: reservation?._id,
                        amount: hostCalculatePriceFromGuest,
                        cause: 'Cancel Order By Guest(Offer)',
                        transactionType: '+',
                    });

                } else {
                    if (Math.ceil(existsCountDays) === reservation?.dates?.length) return error().resourceError(res, 'You can not cancel this reservation!', 404);

                    const { guestPrice, hostPrice, stayedDays } = await guestCancelPriceCalculateAfterCheckIn(reservation, Math.ceil(existsCountDays));

                    // get Commission rate
                    const getCommissionFee = await getCommission({ type: 'host' });
                    const commissionFee = getCommissionFee?.percentage || 0;
                    const commission = ((hostPrice * commissionFee) / 100) || 0;
                    const hostPriceWithCommission = hostPrice - commission;

                    // Update Reservation
                    await updateReservation({
                        _id: reservation?._id,
                        guestId: req.user?._id,
                        status: { $nin: ['Completed', 'Declined', 'Cancelled'] }
                    }, {
                        cancelledDates: null,
                        dates: stayedDays,
                        status: 'Cancelled',
                        reservationCancelledDate: new Date(),
                        cancelledReason: req.body?.cancelledReason || 'Cancelled from the Guest Side',
                    });

                    // Host Wallet Transactions Add
                    await addTransactionInWallet({
                        userId: reservation?.hostId,
                        userType: 'host',
                    }, {
                        reservationId: reservation?._id,
                        amount: hostPriceWithCommission,
                        cause: 'Cancel Order By Guest(Offer)',
                        transactionType: '+',
                    });

                    // Guest Wallet Transactions Add
                    await addTransactionInWallet({
                        userId: req?.user?._id,
                        userType: 'guest',
                    }, {
                        reservationId: reservation?._id,
                        amount: guestPrice,
                        cause: 'Cancel Order By Guest',
                        transactionType: '+',
                    });
                }
            }

            //check existing chat
            const isExistChat = await checkChatExist({
                guestId: req.user?._id,
                hostId: reservation?.hostId,
                admin: false
            });
            //send message
            if (!isExistChat) {
                await createChat({
                    messages: [{
                        text: 'Reservation Cancelled',
                        sender: 'neural'
                    }],
                    guestId: req.user?._id,
                    hostId: reservation?.hostId
                });
            } else {
                await addMessageInChat(
                    {
                        guestId: req.user?._id,
                        hostId: reservation?.hostId,
                        admin: false
                    },
                    { text: 'Reservation Cancelled', sender: 'neural' }
                );
            }

            //Event Emit for Socket IO
            const eventEmitter = req.app.get('eventEmitter');
            eventEmitter.emit('host-new-message-form-guest', { guestId: req.user?._id, hostId: reservation?.hostId, });
            eventEmitter.emit('reservationCancelled', { hostId: reservation?.hostId });

            //send response
            return res.status(200).json({ message: 'Reservation Cancelled.' });
        },


        // Host
        requestReservationAcceptedByHost: async (req, res) => {
            const { reservationId } = req.params;
            // update a reservation
            const reservation = await updateReservation(
                { id: reservationId, 'payment.status': 'Pending' },
                { status: 'Accepted', requestedAcceptedDate: Date.now() }
            );
            if (!reservation) return error().resourceError(res, 'Reservation Updated Failed!', 404);

            //cancel the scheduled job
            let scheduledJob = schedule?.scheduledJobs[`${reservation?._id}CREATED`];
            scheduledJob && scheduledJob?.cancel();

            // 12 hour to check if this reservation payment is completed by guest
            const date = new Date(new Date(reservation.updatedAt).getTime() + 60 * 60 * 12 * 1000);
            // const date = new Date(new Date(reservation.updatedAt).getTime() + 2 * 60 * 1000);
            schedule.scheduleJob(`${reservation?._id}PAYMENT_PENDING`, date, async function () {
                await updateReservation({ _id: reservation?._id, status: 'Accepted', 'payment.status': 'Pending' }, { status: 'Cancelled', cancelledReason: 'No Payment Response received in 12 Hours' });
            });

            //check existing chat
            const isExistChat = await checkChatExist({ hostId: req.user?._id, guestId: reservation?.guestId, admin: false });
            if (!isExistChat) {
                await createChat({ messages: [{ text: 'Reservation Accepted', sender: 'neural' }], hostId: req.user?._id, guestId: reservation?.guestId });
            } else {
                await addMessageInChat(
                    { hostId: req.user?._id, guestId: reservation?.guestId, admin: false },
                    { text: 'Reservation Accepted', sender: 'neural' }
                );
            }
            //Event Emit for Socket IO
            const eventEmitter = req.app.get('eventEmitter');
            eventEmitter.emit('guest-new-message-form-host', { hostId: req.user?._id, guestId: reservation?.guestId, });
            eventEmitter.emit('reservationAccepted', { guestId: reservation?.guestId, });

            return res.status(200).json(reservation);
        },

        requestReservationDeclinedByHost: async (req, res) => {
            const { reservationId } = req.params;
            // update  a reservation
            const reservation = await updateReservation({ id: reservationId, status: 'Requested' }, { status: 'Declined' });
            if (!reservation) return error().resourceError(res, 'Reservation Updated Failed!', 404);

            //cancel the scheduled job
            let scheduledJob = schedule.scheduledJobs[`${reservation?._id}CREATED`];
            scheduledJob && scheduledJob?.cancel();

            //check existing chat
            const isExistChat = await checkChatExist({ hostId: req.user?._id, guestId: reservation?.guestId, admin: false });
            if (!isExistChat) {
                await createChat({ messages: [{ text: 'Reservation Declined', sender: 'neural' }], hostId: req.user?._id, guestId: reservation?.guestId });
            } else {
                await addMessageInChat(
                    { hostId: req.user?._id, guestId: reservation?.guestId, admin: false },
                    { text: 'Reservation Declined', sender: 'neural' }
                );
            }
            //Event Emit for Socket IO
            const eventEmitter = req.app.get('eventEmitter');
            eventEmitter.emit('guest-new-message-form-host', { hostId: req.user?._id, guestId: reservation?.guestId, });
            eventEmitter.emit('reservationDeclined', { guestId: reservation?.guestId, });

            return res.status(200).json(reservation);
        },

        getHostSingleReservation: async (req, res) => {
            const { reservationId, } = req.params;
            //find a reservation
            const reservation = await findReservation({ id: reservationId, hostId: req.user?._id });
            if (!reservation) return error().resourceError(res, 'Reservation Not Found!', 404);
            return res.status(200).json(reservation);
        },

        getHostReservations: async (req, res) => {
            const { skip, limit } = req.query;
            //find al reservations
            const reservations = await findAllReservation({ hostId: req.user?._id }, skip, limit);
            return res.status(200).json(reservations);
        },

        cancelReservationByHost: async (req, res) => {
            const { reservationId } = req.params;
            if (!req.body?.cancelledReason) return error().resourceError(res, 'CancelledReason is Required', 422);
            //find a reservation
            const reservation = await findReservation({
                id: reservationId,
                hostId: req.user?._id,
                status: 'Accepted',
                'payment.status': 'Confirmed',
            });
            if (!reservation) return error().resourceError(res, 'Reservation Not Found!', 404);

            const existsCountDays = (new Date() - new Date(reservation.info.checkInTime)) / (1000 * 60 * 60 * 24);

            if (existsCountDays <= 0) {
                const hostPayablePrice = (reservation?.totalCost * 20) / 100;

                let guestPrice = reservation?.totalCost;

                // Update Reservation
                await updateReservation({
                    _id: reservation?._id,
                    hostId: req.user?._id,
                    status: 'Accepted',
                    'payment.status': 'Confirmed',
                }, {
                    cancelledDates: reservation?.dates,
                    dates: null,
                    status: 'Cancelled',
                    reservationCancelledDate: new Date(),
                    cancelledReason: req.body?.cancelledReason || 'Cancelled from the Host Side',
                });

                // Guest Wallet Transactions Add
                await addTransactionInWallet({
                    userId: reservation?.guestId,
                    userType: 'guest',
                }, {
                    reservationId: reservation?._id,
                    amount: guestPrice,
                    cause: 'Cancel Order By Host',
                    transactionType: '+',
                });

                // Host Wallet Transactions Add
                await addTransactionInWallet({
                    userId: reservation?.hostId,
                    userType: 'host',
                }, {
                    reservationId: reservation?._id,
                    amount: hostPayablePrice,
                    cause: 'Cancel Order By Host',
                    transactionType: '-',
                });

            } else {
                if (Math.ceil(existsCountDays) === reservation?.dates?.length) return error().resourceError(res, 'You can not cancel this reservation!', 404);

                const {
                    guestPrice,
                    stayedDays,
                    hostFine,
                    stayedPrice
                } = await hostCancelPriceCalculateAfterCheckIn(reservation, Math.ceil(existsCountDays));
                // get Commission rate
                const getCommissionFee = await getCommission({ type: 'host' });
                const commissionFee = getCommissionFee?.percentage || 0;
                const commission = ((stayedPrice * commissionFee) / 100) || 0;

                const hostPayablePrice = (stayedPrice - commission) - hostFine;


                // Update Reservation
                await updateReservation({
                    _id: reservation?._id,
                    hostId: req.user?._id,
                    status: 'Accepted',
                    'payment.status': 'Confirmed',
                }, {
                    cancelledDates: reservation?.dates,
                    dates: stayedDays,
                    status: 'Cancelled',
                    reservationCancelledDate: new Date(),
                    cancelledReason: req.body?.cancelledReason || 'Cancelled from the Host Side',
                });

                // Guest Wallet Transactions Add
                await addTransactionInWallet({
                    userId: reservation?.guestId,
                    userType: 'guest',
                }, {
                    reservationId: reservation?._id,
                    amount: guestPrice,
                    cause: 'Cancel Order By Host',
                    transactionType: '+',
                });

                // Host Wallet Transactions Add
                await addTransactionInWallet({
                    userId: reservation?.hostId,
                    userType: 'host',
                }, {
                    reservationId: reservation?._id,
                    amount: hostPayablePrice || 0,
                    cause: 'Cancel Order By Host',
                    transactionType: '+',
                });

                let now = new Date();
                // Guest Gift Price
                await updateUser(
                    { _id: reservation?.guestId },
                    {
                        percentage: 10,
                        validity: now.setDate(now.getDate() + 10),
                        maxDiscountPrice: hostFine
                    })
            }


            //check existing chat
            const isExistChat = await checkChatExist({
                guestId: reservation?.guestId,
                hostId: req.user?._id,
                admin: false
            });
            //send message
            if (!isExistChat) {
                await createChat({
                    messages: [{
                        text: 'Reservation Cancelled',
                        sender: 'neural'
                    }],
                    guestId: reservation?.guestId,
                    hostId: req.user?._id,
                });
            } else {
                await addMessageInChat(
                    {
                        guestId: reservation?.guestId,
                        hostId: req.user?._id,
                        admin: false
                    },
                    { text: 'Reservation Cancelled', sender: 'neural' }
                );
            }

            //Event Emit for Socket IO
            const eventEmitter = req.app.get('eventEmitter');
            eventEmitter.emit('guest-new-message-form-host', {
                guestId: reservation?.guestId,
                hostId: req.user?._id,
            });
            eventEmitter.emit('reservationCancelled', { guestId: reservation?.guestId });

            //send response
            return res.status(200).json({ message: 'Reservation Cancelled.' });
        },
    }
}
export { reservationController };