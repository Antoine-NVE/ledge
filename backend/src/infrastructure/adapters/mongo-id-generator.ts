import type { IdGenerator } from '../../application/ports/id-generator.js';
import { ObjectId } from 'mongodb';

export class MongoIdGenerator implements IdGenerator {
    generate = (): string => {
        return new ObjectId().toString();
    };

    isValid = (id: string): boolean => {
        return ObjectId.isValid(id);
    };
}
