import { verifyAccessToken } from '../services/auth';

export const authenticate = (req: any, res: any, next: any) => {
    const access_token = req.cookies.access_token;

    if (!access_token) {
        return res.status(401).json({
            message: 'Unauthorized',
            data: null,
            errors: null,
        });
    }

    const decoded = verifyAccessToken(access_token);
    if (!decoded) {
        return res.status(401).json({
            message: 'Unauthorized',
            data: null,
            errors: null,
        });
    }

    req.user = decoded;
    next();
};
