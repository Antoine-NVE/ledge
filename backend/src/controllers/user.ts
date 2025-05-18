import { Request, Response } from 'express';
import UserModel from '../models/User';

export const me = async (req: Request, res: Response) => {
    try {
        const userId = req.userId;

        const user = await UserModel.findById(userId);

        if (!user) {
            res.status(404).json({
                message: 'User not found',
                data: null,
                errors: null,
            });
            return;
        }

        res.status(200).json({
            message: 'User retrieved successfully',
            data: {
                user,
            },
            errors: null,
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Internal server error',
            data: null,
            errors: null,
        });
    }
};
