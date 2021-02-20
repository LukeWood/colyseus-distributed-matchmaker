import {RedisPresence} from 'colyseus';

export const presence = new RedisPresence({
  host: process.env.REDIS_HOST,
  port: Number.parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSORT
});
