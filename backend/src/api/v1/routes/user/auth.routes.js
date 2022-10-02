import { authController } from '../../controllers/user';
import { tryCatchHandle } from '../../utils';
import { fileUpload } from '../../middlewares/image';

function authRoutes(app) {
    app.post('/user/sign-in', tryCatchHandle(authController().signIn));
    app.post('/user/sign-up', fileUpload.single('image'), tryCatchHandle(authController().signUp));
    app.post('/user/verify-sign-up', fileUpload.single('image'),tryCatchHandle(authController().verifySignUp));
}
export { authRoutes };