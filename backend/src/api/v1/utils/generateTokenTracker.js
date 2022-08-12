import crypto from 'crypto';
export default async () => {
    return crypto.randomBytes(4).toString("hex")
}