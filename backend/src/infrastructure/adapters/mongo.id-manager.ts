import type { IdManager } from '../../domain/ports/id-manager.js';
import { ObjectId } from 'mongodb';

export class MongoIdManager implements IdManager {
    generate = (): string => {
        return new ObjectId().toString();
    };

    validate = (id: string): boolean => {
        return ObjectId.isValid(id);
    };
}
