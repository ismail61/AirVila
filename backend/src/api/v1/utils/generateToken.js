import jwt from 'jsonwebtoken'
import { config } from '../../../config'

export default (user) => {
    return jwt.sign({
        _id: user._id,
        id: user.id,
        email: user.email,
        phone: user.phone
    }, config?.user_jwt?.key, {
        expiresIn: config?.user_jwt?.expire
    })
}