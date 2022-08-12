import { authController } from "../../controllers/user";
import { tryCatchHandle } from "../../utils";

function authRoutes(app) {
    app.post('/user/sign-in', tryCatchHandle(authController().signIn));
    app.post('/user/sign-up', tryCatchHandle(authController().signUp));
    app.post('/user/verify-sign-up', tryCatchHandle(authController().verifySignUp));
}
export { authRoutes };