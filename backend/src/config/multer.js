const { MULTER_FILE_SIZE, MULTER_FILE_EXTENSIONS } = process.env;

export const multerConfig = {
    maxFileSize: Number(MULTER_FILE_SIZE) || 3 * 1024 * 1024, // 3 MB
    mimeTypes: MULTER_FILE_EXTENSIONS || ['image/png', 'image/jpeg', 'image/jpg', 'image/gif']
}