import express from 'express';
import cors from 'cors';
import { RedisPresence } from 'colyseus';
import {joinOrCreate} from './joinOrCreate';
import { MongooseDriver } from "colyseus/lib/matchmaker/drivers/MongooseDriver"

const driver = new MongooseDriver();
function findPort(): number {
  if (process.env.PORT) {
    return parseInt(process.env.PORT);
  }
  return 7337;
}

const port = findPort();

const app = express();
app.use(cors());
app.use(express.json());

const presence = new RedisPresence({
  host: process.env.REDIS_HOST,
  port: Number.parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSORT
});

app.post('/joinOrCreate', joinOrCreate(driver, presence))

app.listen(port)
console.info(`Listening on ws://localhost:${port}`)
