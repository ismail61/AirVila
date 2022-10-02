import { addCommission, getCommission, getCommissions, updateCommission } from '../../services/admin';
import { error } from '../../utils';

function commissionController() {
    return {
        // commission add 
        addCommission: async (req, res) => {
            const { percentage, type } = req.body;
            if (!percentage || !type) return error().resourceError(res, 'Commission percentage or Commission Type is required!', 422);

            const commissions = await getCommissions({});
            if (commissions.length > 1) return error().resourceError(res, 'Commission Already Exists!', 404);

            const commission = await addCommission(req.body);
            if (!commission) return error().resourceError(res, 'Commission Added Failed!', 404);
            return res.status(200).json(commission);
        },

        // commission remove 
        updateCommission: async (req, res) => {
            const { commissionId } = req.params;

            const commission = await getCommission({ _id: commissionId });
            if (!commission) return error().resourceError(res, 'Commission Not Found!', 404);

            const updatedCommission = await updateCommission({ _id: commissionId }, req.body);
            if (!updatedCommission) return error().resourceError(res, 'Commission Updated Failed!', 404);
            return res.status(200).json(updatedCommission);
        },

        // get single commission
        getCommission: async (req, res) => {
            const commission = await getCommission({ _id: req.params?.commissionId });
            if (!commission) return error().resourceError(res, 'Commission Not Found!', 404);
            return res.status(200).json(commission);
        },

        // get all commissions
        getCommissions: async (req, res) => {
            const commissions = await getCommissions({});
            return res.status(200).json(commissions);
        },

        // get guest commission 
        getGuestCommission: async (req, res) => {
            const commission = await getCommission({ type: 'guest' });
            if (!commission) return error().resourceError(res, 'Commission Not Found!', 404);
            return res.status(200).json(commission);
        },

        // get host commission 
        getHostCommission: async (req, res) => {
            const commission = await getCommission({ type: 'host' });
            if (!commission) return error().resourceError(res, 'Commission Not Found!', 404);
            return res.status(200).json(commission);
        },
    }
}
export { commissionController };