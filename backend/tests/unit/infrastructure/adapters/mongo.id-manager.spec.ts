import { describe, it, expect } from 'vitest';
import { MongoIdManager } from '../../../../src/infrastructure/adapters/mongo.id-manager.js';

describe('MongoIdManager', () => {
    const idManager = new MongoIdManager();

    describe('generate', () => {
        it('should generate a valid MongoDB ObjectId string', () => {
            const id = idManager.generate();

            expect(typeof id).toBe('string');
            expect(id).toHaveLength(24);
        });
    });

    describe('validate', () => {
        it('should return true for a valid existing ID', () => {
            const validId = '507f1f77bcf86cd799439011';
            expect(idManager.validate(validId)).toBe(true);
        });

        it('should return false for an invalid ID string', () => {
            const invalidId = 'invalid-id-string';
            expect(idManager.validate(invalidId)).toBe(false);
        });
    });
});
