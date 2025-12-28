import db from '../models/index.js';

export const isAdmin = async (req, res, next) => {
    try {
        // verifyToken đã gán req.user.id
        const userId = req.user?.id;

        if (!userId)
            return res.status(401).json({ err: 1, msg: 'Unauthorized' });

        const user = await db.User.findByPk(userId, {
            include: [
                {
                    model: db.Role,
                    as: 'roles',
                    where: { name: 'admin' },
                    through: { attributes: [] }
                }
            ]
        });

        if (!user)
        return res.status(403).json({ err: 1, msg: 'Forbidden - Admin only' });

        next();
    } catch (error) {
        return res.status(500).json({ err: 1, msg: error.message });
    }
};
