const {
    PORT,
    DB_URL,
    EMAIL,
    EMAIL_USER_NAME,
    EMAIL_PASSWORD,
    USER_JWT_SECRET_KEY,
    CRYPTO_SECRET_KEY,
    SMS_URI,
    SMS_API_USER_NAME,
    SMS_API_PASSWORD,
    USER_JWT_COOKIE_EXPIRES_IN,
    NODE_ENV,
    GOOGLE_CLIENT_ID
} = process.env

const config = {
    env: {
        NODE_ENV: NODE_ENV
    },
    app: {
        port: parseInt(PORT)
    },
    mongo_db: {
        url: DB_URL
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
    }
};

export { config }