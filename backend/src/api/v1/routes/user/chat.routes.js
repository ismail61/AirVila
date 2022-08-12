import { chatController } from "../../controllers/common";
import { userAuthentication } from "../../middlewares/user";
import { tryCatchHandle } from "../../utils";

function guestChatRoutes(app) {
  // Guest
  app.post('/guest/chat/send-message-to-host', userAuthentication, tryCatchHandle(chatController().sendMessageToHost));
  app.post('/guest/chat/send-message-to-admin', userAuthentication, tryCatchHandle(chatController().sendMessageToAdmin));
  app.get('/guest/chat/get-messages-from-hosts', userAuthentication, tryCatchHandle(chatController().getMessagesFromHosts));
  app.get('/guest/chat/get-messages-from-admin', userAuthentication, tryCatchHandle(chatController().getMessagesFromAdmin));
  app.get('/guest/chat/get-messages-from-host/:hostId', userAuthentication, tryCatchHandle(chatController().getMessagesFromSingleHost));

  // Host
  app.post('/host/chat/send-message-to-guest', userAuthentication, tryCatchHandle(chatController().sendMessageToGuest));
  app.post('/host/chat/send-message-to-admin', userAuthentication, tryCatchHandle(chatController().sendMessageToAdminFromHost));
  app.get('/host/chat/get-messages-from-guests', userAuthentication, tryCatchHandle(chatController().getMessagesFromGuests));
  app.get('/host/chat/get-messages-from-admin', userAuthentication, tryCatchHandle(chatController().getMessagesFromAdminToHost));
  app.get('/host/chat/get-messages-from-guest/:guestId', userAuthentication, tryCatchHandle(chatController().getMessagesFromSingleGuest)); 

  // Admin
  app.post('/admin/chat/send-message-to-guest', tryCatchHandle(chatController().sendMessageToGuestFormAdmin));
  app.post('/admin/chat/send-message-to-host', tryCatchHandle(chatController().sendMessageToHostFromAdmin));
  app.get('/admin/chat/get-messages-from-guests', tryCatchHandle(chatController().getMessagesFromGuestsToAdmin));
  app.get('/admin/chat/get-messages-from-hosts', tryCatchHandle(chatController().getMessagesFromHostsToAdmin));
  app.get('/admin/chat/get-messages-from-guest/:guestId', tryCatchHandle(chatController().getMessagesFromSingleGuestToAdmin)); 
  app.get('/admin/chat/get-messages-from-host/:hostId', tryCatchHandle(chatController().getMessagesFromSingleHostToAdmin)); 
}
export { guestChatRoutes };