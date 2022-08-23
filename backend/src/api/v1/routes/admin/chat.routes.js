import { chatController } from "../../controllers/common";
import { tryCatchHandle } from "../../utils";

function adminChatRoutes(app) {
    app.post('/admin/AIR@123/chat/send-message-to-guest', tryCatchHandle(chatController().sendMessageToGuestFormAdmin));
    app.post('/admin/AIR@123/chat/send-message-to-host', tryCatchHandle(chatController().sendMessageToHostFromAdmin));
    app.get('/admin/AIR@123/chat/get-messages-from-guests', tryCatchHandle(chatController().getMessagesFromGuestsToAdmin));
    app.get('/admin/AIR@123/chat/get-messages-from-hosts', tryCatchHandle(chatController().getMessagesFromHostsToAdmin));
    app.get('/admin/AIR@123/chat/get-messages-from-guest/:guestId', tryCatchHandle(chatController().getMessagesFromSingleGuestToAdmin));
    app.get('/admin/AIR@123/chat/get-messages-from-host/:hostId', tryCatchHandle(chatController().getMessagesFromSingleHostToAdmin));
}
export { adminChatRoutes };