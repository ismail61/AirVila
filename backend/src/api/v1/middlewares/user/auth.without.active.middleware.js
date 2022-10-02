import jwt from 'jsonwebtoken'
import { config } from '../../../../config'
import { findUser } from '../../services/user';

export const userAuthenticationWithoutActive = async (req, res, next) => {
    const BearerToken =
        req.body.token || req.query.token || req.headers['x-access-token'] || req.header('Authorization');

    if (!BearerToken || !BearerToken.startsWith('Bearer ')) {
        return res.status(403).json({ err: 'A token is required for authentication' });
    }
    try {
        const token = BearerToken.substring(7, BearerToken.length);
        const verify_token = jwt.verify(token, config.user_jwt.key);
        const vendor = await findUser({ _id: verify_token._id })
        if (!vendor) return res.status(401).send({ err: 'Invalid Token' });
        req.user = verify_token;
    } catch (err) {
        return res.status(401).send({ err: 'Invalid Token' });
    }
    return next();
};