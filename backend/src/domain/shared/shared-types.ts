import { ObjectId } from 'mongodb';

export type BaseDocument = {
    _id: ObjectId;
    createdAt: Date;
    updatedAt?: Date;
};
