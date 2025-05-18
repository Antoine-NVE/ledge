import { NextFunction, Request, Response } from 'express';
import { verifyAccessToken } from '../services/auth';

// Extend Express Request interface to include userId
declare module 'express-serve-static-core' {
    interface Request {
        userId: string;
    }
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.cookies?.access_token;

    if (!access_token) {
        res.status(401).json({
            message: 'Unauthorized',
            data: null,
            errors: null,
        });
        return;
    }

    const decoded = verifyAccessToken(access_token);

    if (typeof decoded === 'object' && decoded !== null && '_id' in decoded) {
        req.userId = (decoded as { _id: string })._id;
        next();
        return;
    }

    res.status(401).json({
        message: 'Unauthorized',
        data: null,
        errors: null,
    });
};

export default authenticate;
