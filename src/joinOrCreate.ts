import {parseNodeAddr} from './util';
import {presence} from './presence';
import {matchmaker} from './matchmaker';

interface JoinOrCreateRequest {
  body: {
    roomName?: string;
  }
}

export async function joinOrCreate(req: JoinOrCreateRequest, res: any) {
  let roomName = req.body.roomName;
  console.info("Received request for room " + req.body.roomName);
  let result = await matchmaker.findOne({
    locked: false,
    name: roomName,
    private: false,
  })

  if (result) {
    const serverString = await presence.get(result.roomId);
    if (serverString && typeof serverString ==='string') {
      const parts = serverString.split("/");
      if (parts.length > 1) {
        const server = parts[1]
        console.log("Allocated to existing lobby", server);
        return res.status(200).json({server: server});
      }
    }
    console.info("No server found for roomId", result.roomId);
  }
  const roomcounts = await presence.hgetall('roomcount');
  const servers = await presence.smembers('game-servers')
  console.info("Found servers ", servers);

  const minimumCount = servers.map((nodeAddr) => parseNodeAddr(nodeAddr))
    .map((node) => {
      return {roomcount: roomcounts[node.id] || 0, address: node.address};
    }).reduce((min, p) => {
      if (!min) {
        return p;
      }
      if (min.roomcount < p.roomcount) {
        return min;
      };
      if (min.roomcount === p.roomcount) {
        return Math.random() > 0.5 ? min : p;
      }
      return p;
    }, null)

  if (!minimumCount) {
    return res.status(500).send('No available servers');
  }
  console.info("Creating new lobby on ", minimumCount.address)
  return res.status(200).json({server: minimumCount.address});
}
