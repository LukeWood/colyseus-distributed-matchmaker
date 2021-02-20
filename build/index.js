"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const colyseus_1 = require("colyseus");
const joinOrCreate_1 = require("./joinOrCreate");
const MongooseDriver_1 = require("colyseus/lib/matchmaker/drivers/MongooseDriver");
const driver = new MongooseDriver_1.MongooseDriver();
function findPort() {
    if (process.env.PORT) {
        return parseInt(process.env.PORT);
    }
    return 7337;
}
const port = findPort();
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
const presence = new colyseus_1.RedisPresence({
    host: process.env.REDIS_HOST,
    port: Number.parseInt(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSORT
});
app.post('/joinOrCreate', joinOrCreate_1.joinOrCreate(driver, presence));
app.listen(port);
console.info(`Listening on ws://localhost:${port}`);
