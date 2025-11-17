import { createClient, RedisClientType } from 'redis';

export const client: RedisClientType = createClient({
    url: 'redis://cache:6379',
});

(async () => {
    try {
        await client.connect();

        console.log('Redis connected');
    } catch (err) {
        console.error('Redis connection failed:', err);
        process.exit(1);
    }
})();
