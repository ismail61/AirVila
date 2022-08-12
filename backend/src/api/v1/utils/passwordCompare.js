
import bcrypt from 'bcrypt';
export default async (password, user) => {
    return await bcrypt.compare(password, user?.password);
}