import { accountController } from '../../controllers/user';
import { userAuthenticationWithoutActive } from '../../middlewares/user';
import { tryCatchHandle } from '../../utils';

function accountRoutes(app) {
    app.get('/user', userAuthenticationWithoutActive, tryCatchHandle(accountController().getMe));
    app.patch('/user', userAuthenticationWithoutActive, tryCatchHandle(accountController().updateRequest));
}
export { accountRoutes };