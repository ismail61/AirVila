import { getUsers, updateUser } from "../../services/user";
import { error } from "../../utils";

function usersController() {
    return {
        // inactive user 
        inactiveUser: async (req, res) => {
            const { userId } = req.params;
            const user = await updateUser({ _id: userId }, { active: false });
            if (!user) return error().resourceError(res, 'Users Status Updated Failed!', 404);
            return res.status(200).json({ message: "User Status Updated Successful" });
        },

        // active user 
        activeUser: async (req, res) => {
            const { userId } = req.params;
            const user = await updateUser({ _id: userId }, { active: true });
            if (!user) return error().resourceError(res, 'Users Status Updated Failed!', 404);
            return res.status(200).json({ message: "User Status Updated Successful" });
        },

        // get all users
        getAllUsers: async (req, res) => {
            const { skip, limit } = req.query;
            const users = await getUsers({}, skip, limit);
            return res.status(200).json(users);
        },
    }
}
export { usersController };