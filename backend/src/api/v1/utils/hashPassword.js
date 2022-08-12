import bcrypt from 'bcrypt'
export default async (password) => {
    return await bcrypt.hash(password, 10)
}