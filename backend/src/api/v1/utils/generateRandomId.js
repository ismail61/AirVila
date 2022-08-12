import crypto from 'crypto';
export default async () => {
    return crypto.randomInt(100000, 999999);
}