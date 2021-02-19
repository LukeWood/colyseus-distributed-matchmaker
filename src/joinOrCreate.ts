import {RedisPresence} from 'colyseus';
import { MongooseDriver } from "colyseus/lib/matchmaker/drivers/MongooseDriver"

interface JoinOrCreateRequest {
  body: {
    roomName?: string;
  }
}

export function joinOrCreate(driver: MongooseDriver, presence: RedisPresence) {
  return async (req: JoinOrCreateRequest, res: any) => {
    let roomName = req.body.roomName
    let result = await driver.findOne({
      locked: false,
      name: roomName,
      private: false,
    })

    if (result) {
      const server = await presence.get(result.roomId);
      return res.status(200).json({server: server});
    }
    const roomcounts = await presence.hgetall('roomcount');
    const servers = await presence.smembers('colyseus:nodes')

    const minimumCount = servers.map((servString) => servString.split("/"))
      .map(([serverId, serverAddress]) => {
        return {roomcount: roomcounts[serverId] || 0, serverAddress: serverAddress};
      }).reduce((min, p) => {
        if (!min) {
          return p;
        }
        if (min.roomcount < p.roomcount) {
          return min;
        };
        return p;
      }, null)

    if (!minimumCount) {
      return res.status(500).send('No available servers');
    }
    return res.status(200).json({server: minimumCount.serverAddress});
  }
}
