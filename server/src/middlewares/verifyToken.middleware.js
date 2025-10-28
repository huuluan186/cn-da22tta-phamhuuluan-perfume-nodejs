import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware xác thực JWT Access Token
 */
export const verifyToken = (req, res, next) => {
    try {
        // Lấy token từ header Authorization: "Bearer <token>"
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ err: 1, msg: 'Access token is missing or invalid format' });
        }

        const token = authHeader.split(' ')[1];

        // Xác thực token
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                const msg = err.name === 'TokenExpiredError' ? 'Access token has expired' : 'Invalid access token';
                return res.status(401).json({ err: 1, msg });
            }

            // Lưu thông tin user vào req để controller dùng
            req.user = decoded;
            next();
        });
    } catch (error) {
        return res.status(500).json({ err: -1, msg: 'Internal server error' });
    }
};