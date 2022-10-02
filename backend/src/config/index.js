const {
    PORT,
    DB_URL,
    EMAIL,
    EMAIL_USER_NAME,
    EMAIL_PASSWORD,
    USER_JWT_SECRET_KEY,
    CRYPTO_SECRET_KEY,
    SMS_URI,
    SMS_API_EMAIL,
    SMS_API_PASSWORD,
    CLOUDINARY_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET,
    USER_JWT_COOKIE_EXPIRES_IN,
    NODE_ENV,
    GOOGLE_CLIENT_ID
} = process.env

const config = {
    env: {
        NODE_ENV: NODE_ENV || 'DEV'
    },
    app: {
        port: parseInt(PORT) || 7890
    },
    mongo_db: {
        url: DB_URL || 'mongodb://localhost:27017/airvila'
    },
    user_jwt: {
        key: USER_JWT_SECRET_KEY,
        expire: USER_JWT_COOKIE_EXPIRES_IN
    },
    email: {
        address: EMAIL,
        username: EMAIL_USER_NAME,
        password: String(EMAIL_PASSWORD)
    },
    encrypt: {
        key: CRYPTO_SECRET_KEY
    },
    cloudinary: {
        name: CLOUDINARY_NAME,
        api: CLOUDINARY_API_KEY,
        secret: CLOUDINARY_API_SECRET
    },
    sms: {
        uri: SMS_URI,
        user: SMS_API_EMAIL,
        password: SMS_API_PASSWORD
    },
    google: {
        client_id: GOOGLE_CLIENT_ID
    }
};

export { config }