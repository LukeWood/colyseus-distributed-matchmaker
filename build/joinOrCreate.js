"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinOrCreate = void 0;
function joinOrCreate(driver, presence) {
    return (req, res) => __awaiter(this, void 0, void 0, function* () {
        let roomName = req.body.roomName;
        console.info("Received request for room " + req.body.roomName);
        let result = yield driver.findOne({
            locked: false,
            name: roomName,
            private: false,
        });
        if (result) {
            const serverString = yield presence.get(result.roomId);
            if (serverString && typeof serverString === 'string') {
                const parts = serverString.split("/");
                if (parts.length > 1) {
                    const server = parts[1];
                    console.log("Allocated to existing lobby", server);
                    return res.status(200).json({ server: server });
                }
            }
            console.info("No server found for roomId", result.roomId);
        }
        const roomcounts = yield presence.hgetall('roomcount');
        const servers = yield presence.smembers('game-servers');
        console.info("Found servers ", servers);
        const minimumCount = servers.map((servString) => servString.split("/"))
            .map(([serverId, serverAddress]) => {
            return { roomcount: roomcounts[serverId] || 0, serverAddress: serverAddress };
        }).reduce((min, p) => {
            if (!min) {
                return p;
            }
            if (min.roomcount < p.roomcount) {
                return min;
            }
            ;
            if (min.roomcount === p.roomcount) {
                return Math.random() > 0.5 ? min : p;
            }
            return p;
        }, null);
        if (!minimumCount) {
            return res.status(500).send('No available servers');
        }
        console.info("Creating new lobby on ", minimumCount.serverAddress);
        return res.status(200).json({ server: minimumCount.serverAddress });
    });
}
exports.joinOrCreate = joinOrCreate;
