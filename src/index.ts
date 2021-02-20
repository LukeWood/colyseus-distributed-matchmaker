import express from 'express';
import cors from 'cors';
import { startHealthChecks } from './healthcheck';
import {joinOrCreate} from './joinOrCreate';

function findPort(): number {
  if (process.env.PORT) {
    return parseInt(process.env.PORT);
  }
  return 7337;
}

startHealthChecks();
const port = findPort();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/joinOrCreate', joinOrCreate)

app.listen(port)
console.info(`colyseus-distributed-matchmaker listening on on http://localhost:${port}`)
