import jwt from 'jsonwebtoken'
import { config } from '../../../../config'
import { findUser } from '../../services/user';
import { error } from '../../utils';

export const userAuthentication = async (req, res, next) => {
    const BearerToken =
        req.body.token || req.query.token || req.headers["x-access-token"] || req.header('Authorization');

    if (!BearerToken || !BearerToken.startsWith('Bearer ')) {
        return res.status(403).json({ err: "A token is required for authentication" });
    }
    try {
        const token = BearerToken.substring(7, BearerToken.length);
        const verify_token = jwt.verify(token, config.user_jwt.key);
        const user = await findUser({ _id: verify_token._id });
        if (!user) return res.status(401).send({ err: "Invalid or Expired Token" });
        if (user?.active === false) return error().resourceError(res, 'Your account has not been activated. Please contact Admin or Administrator', 400)
        req.user = verify_token;
    } catch (err) {
        return res.status(401).json({ err: "Invalid Token" });
    }
    return next();
};