import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { multerConfig } from '../../../../config/multer';

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        const fileName = file.originalname.toLowerCase().split(' ').join('-');
        cb(null, uuidv4() + '-' + fileName)
    }
});
export const fileUpload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        req.fileExtensionValidationError = false;
        if (multerConfig.mimeTypes.includes(file.mimetype)) {
            cb(null, true, req.fileExtensionValidationError);
        } else {
            req.fileExtensionValidationError = true;
            return cb(null, false, req.fileExtensionValidationError);
        }
    },
    limits: {
        fileSize: +multerConfig.maxFileSize,
    },
});