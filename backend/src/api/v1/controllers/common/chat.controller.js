
import {
    addMessageInChat,
    checkChatExist,
    createChat,
    getAllChats,
    getSingleChat,
} from '../../services/common';
import { findUser } from '../../services/user';
import { error } from '../../utils';
let checkForValidMongoDbID = new RegExp('^[0-9a-fA-F]{24}$');

function chatController() {
    return {
        // guest chats
        sendMessageToHost: async (req, res) => {
            const { hostId, text } = req.body;

            const doesOrdered = await findUser({ 'orderedHost.$.id': hostId });
            if (!doesOrdered) return error().resourceError(res, 'Sorry. You need to order first from the host.', 422);

            if (!text) return error().resourceError(res, 'Message Text is Required', 422);
            if (!hostId) return error().resourceError(res, 'Host ID is Required', 422);

            //check existing chat
            const isExistChat = await checkChatExist({ hostId, guestId: req.user?._id, admin: false });
            if (!isExistChat) {
                const chat = await createChat({ messages: [{ ...req.body, sender: 'guest' }], guestId: req.user?._id, hostId });
                //Event Emit for Socket IO
                const eventEmitter = req.app.get('eventEmitter');
                eventEmitter.emit('host-new-message-form-guest', { hostId, guestId: req.user?._id });
                return res.status(200).json(chat);
            }

            const chat = await addMessageInChat({ hostId, guestId: req.user?._id, admin: false }, { ...req.body, sender: 'guest' });
            //Event Emit for Socket IO
            const eventEmitter = req.app.get('eventEmitter');
            eventEmitter.emit('host-new-message-form-guest', { hostId, guestId: req.user?._id });
            return res.status(200).json(chat);
        },
        sendMessageToAdmin: async (req, res) => {
            const { text } = req.body;
            if (!text) return error().resourceError(res, 'Message Text is Required', 422);

            //check existing chat
            const isExistChat = await checkChatExist({ admin: true, guestId: req.user?._id });
            if (!isExistChat) {
                const chat = await createChat({ messages: [{ ...req.body, sender: 'guest' }], guestId: req.user?._id, admin: true });
                //Event Emit for Socket IO
                const eventEmitter = req.app.get('eventEmitter');
                eventEmitter.emit('admin-new-message', { guestId: req.user?._id });
                return res.status(200).json(chat);
            }

            const chat = await addMessageInChat({ admin: true, guestId: req.user?._id }, { ...req.body, sender: 'guest' });
            //Event Emit for Socket IO
            const eventEmitter = req.app.get('eventEmitter');
            eventEmitter.emit('admin-new-message', { guestId: req.user?._id });
            return res.status(200).json(chat);
        },
        getMessagesFromHosts: async (req, res) => {
            const chats = await getAllChats({ guestId: req.user?._id, admin: false });
            return res.status(200).json(chats);
        },
        getMessagesFromAdmin: async (req, res) => {
            const chats = await getAllChats({ guestId: req.user?._id, admin: true });
            return res.status(200).json(chats);
        },
        getMessagesFromSingleHost: async (req, res) => {
            if (checkForValidMongoDbID.test(req.params?.hostId)) {
                const chat = await getSingleChat({ guestId: req.user?._id, hostId: req.params?.hostId });
                return res.status(200).json(chat);
            }
        },


        // host chats
        sendMessageToGuest: async (req, res) => {
            const { guestId, text } = req.body;

            if (!text) return error().resourceError(res, 'Message Text is Required', 422);
            if (!guestId) return error().resourceError(res, 'Guest ID is Required', 422);

            //check existing chat
            const isExistChat = await checkChatExist({ guestId, hostId: req.user?._id, admin: false });
            if (!isExistChat) return error().resourceError(res, 'Sorry. You can not do this.', 422);

            const chat = await addMessageInChat({ guestId, hostId: req.user?._id, admin: false }, { ...req.body, sender: 'host' });
            //Event Emit for Socket IO
            const eventEmitter = req.app.get('eventEmitter');
            eventEmitter.emit('guest-new-message', { guestId, hostId: req.user?._id });
            return res.status(200).json(chat);
        },
        sendMessageToAdminFromHost: async (req, res) => {
            const { text } = req.body;
            if (!text) return error().resourceError(res, 'Message Text is Required', 422);

            //check existing chat
            const isExistChat = await checkChatExist({ admin: true, hostId: req.user?._id });
            if (!isExistChat) {
                const chat = await createChat({ messages: [{ ...req.body, sender: 'host' }], hostId: req.user?._id, admin: true });
                //Event Emit for Socket IO
                const eventEmitter = req.app.get('eventEmitter');
                eventEmitter.emit('admin-new-message', { hostId: req.user?._id });
                return res.status(200).json(chat);
            }

            const chat = await addMessageInChat({ admin: true, hostId: req.user?._id }, { ...req.body, sender: 'host' });
            //Event Emit for Socket IO
            const eventEmitter = req.app.get('eventEmitter');
            eventEmitter.emit('admin-new-message');
            return res.status(200).json(chat);
        },
        getMessagesFromGuests: async (req, res) => {
            const chats = await getAllChats({ hostId: req.user?._id, admin: false });
            return res.status(200).json(chats);
        },
        getMessagesFromAdminToHost: async (req, res) => {
            const chats = await getAllChats({ hostId: req.user?._id, admin: true });
            return res.status(200).json(chats);
        },
        getMessagesFromSingleGuest: async (req, res) => {
            if (checkForValidMongoDbID.test(req.params?.guestId)) {
                const chat = await getSingleChat({ hostId: req.user?._id, guestId: req.params?.guestId });
                return res.status(200).json(chat);
            }
        },


        // admin chats
        sendMessageToGuestFormAdmin: async (req, res) => {
            const { guestId, text } = req.body;

            if (!text) return error().resourceError(res, 'Message Text is Required', 422);
            if (!guestId) return error().resourceError(res, 'Guest ID is Required', 422);

            //check existing chat
            const isExistChat = await checkChatExist({ guestId, admin: true });
            if (!isExistChat) {
                const chat = await createChat({ messages: [{ ...req.body }], guestId, admin: true });
                //Event Emit for Socket IO
                const eventEmitter = req.app.get('eventEmitter');
                eventEmitter.emit('guest-new-message-form-admin', { guestId });
                return res.status(200).json(chat);
            }

            const chat = await addMessageInChat({ guestId, admin: true }, { ...req.body });
            //Event Emit for Socket IO
            const eventEmitter = req.app.get('eventEmitter');
            eventEmitter.emit('guest-new-message-form-admin', { guestId });
            return res.status(200).json(chat);
        },
        sendMessageToHostFromAdmin: async (req, res) => {
            const { hostId, text } = req.body;

            if (!text) return error().resourceError(res, 'Message Text is Required', 422);
            if (!hostId) return error().resourceError(res, 'Host ID is Required', 422);

            //check existing chat
            const isExistChat = await checkChatExist({ hostId, admin: true });
            if (!isExistChat) {
                const chat = await createChat({ messages: [{ ...req.body }], hostId, admin: true });
                //Event Emit for Socket IO
                const eventEmitter = req.app.get('eventEmitter');
                eventEmitter.emit('host-new-message-form-admin', { hostId });
                return res.status(200).json(chat);
            }

            const chat = await addMessageInChat({ hostId, admin: true }, { ...req.body });
            //Event Emit for Socket IO
            const eventEmitter = req.app.get('eventEmitter');
            eventEmitter.emit('host-new-message-form-admin', { hostId });
            return res.status(200).json(chat);
        },
        getMessagesFromGuestsToAdmin: async (req, res) => {
            const chats = await getAllChats({ guestId: { $exists: true, $ne: null }, admin: true });
            return res.status(200).json(chats);
        },
        getMessagesFromHostsToAdmin: async (req, res) => {
            const chats = await getAllChats({ hostId: { $exists: true, $ne: null }, admin: true });
            return res.status(200).json(chats);
        },
        getMessagesFromSingleGuestToAdmin: async (req, res) => {
            if (checkForValidMongoDbID.test(req.params?.guestId)) {
                const chat = await getSingleChat({ admin: true, guestId: req.params?.guestId });
                return res.status(200).json(chat);
            }
        },
        getMessagesFromSingleHostToAdmin: async (req, res) => {
            if (checkForValidMongoDbID.test(req.params?.hostId)) {
                const chat = await getSingleChat({ admin: true, hostId: req.params?.hostId });
                return res.status(200).json(chat);
            }
        },
    }
}
export { chatController };