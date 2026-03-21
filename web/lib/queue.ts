import { Queue } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,
});

export const crawlQueueMeili = new Queue('crawlQueue', { connection: connection as any });
export const crawlQueuePostgres = new Queue('crawlQueue_postgres', { connection: connection as any });
