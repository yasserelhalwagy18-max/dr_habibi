import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-for-dev';
export const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(' ')[1]; // Bearer <token>
        if (!token) {
            res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
            return;
        }
        jwt.verify(token, JWT_SECRET, (err, user) => {
            if (err) {
                res.status(403).json({ success: false, error: 'Forbidden: Invalid token' });
                return;
            }
            req.user = user;
            next();
        });
    }
    else {
        res.status(401).json({ success: false, error: 'Unauthorized: No token provided' });
    }
};
//# sourceMappingURL=authMiddleware.js.map