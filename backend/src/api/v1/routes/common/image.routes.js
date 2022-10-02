import { imageController } from '../../controllers/common';
import { tryCatchHandle } from '../../utils';
import { fileUpload } from '../../middlewares/image';
import { userAuthentication } from '../../middlewares/user';

function imageRoutes(app) {
    app.post('/upload-image', userAuthentication, fileUpload.single('image'), tryCatchHandle(imageController().uploadImage));
    app.delete('/delete-image', userAuthentication, tryCatchHandle(imageController().deleteImage));
}
export { imageRoutes };