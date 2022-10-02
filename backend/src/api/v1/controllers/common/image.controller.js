import { error } from '../../utils';
import cloudinary from 'cloudinary';
import { multerConfig } from '../../../../config/multer';

const imageController = () => {
    return {
        // upload an image
        uploadImage: async (req, res) => {
            if(!req.file) return error().resourceError(res, 'At least one file is Required!', 422);
            if (req.fileExtensionValidationError) return error().resourceError(res, 'Only .png, .jpg, .gif and .jpeg format allowed!', 415);
            if (req.file?.size >= multerConfig.maxFileSize) return error().resourceError(res, 'Image size mus lower than 3 MB', 409);

            const image_upload = await cloudinary.v2.uploader.upload(req.file?.path, { folder: `airvila/${new Date().getFullYear()}/${new Date().getMonth()}/${new Date().getDate()}`, use_filename: true });
            if (!image_upload?.secure_url) return error().resourceError(res, 'Image Saved Failed . Please try again', 500);

            return res.status(200).json({
                public_id: image_upload?.public_id,
                url: image_upload?.secure_url
            });
        },

        // delete an image
        deleteImage: async (req, res) => {
            const { publicId } = req.query;
            console.log(publicId)

            if(!publicId) return error().resourceError(res, 'File Public Id is Required!', 422);
            const response = await cloudinary.v2.uploader.destroy(publicId);
            if (response?.result !== 'ok') return error().resourceError(res, 'Image Deleted Failed . Please try again', 500);

            return res.status(200).json({
                message: 'Image Deleted Successful',
            });
        },
    }
}

export { imageController }