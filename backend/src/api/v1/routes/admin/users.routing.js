import { usersController } from "../../controllers/admin";
import { tryCatchHandle } from "../../utils";

function adminUsersControlRoutes(app) {
    app.patch('/admin/AIR@123/active-users/:userId', tryCatchHandle(usersController().activeUser));
    app.patch('/admin/AIR@123/inactive-users/:userId', tryCatchHandle(usersController().inactiveUser));
    app.get('/admin/AIR@123/users', tryCatchHandle(usersController().getAllUsers));
}
export { adminUsersControlRoutes };