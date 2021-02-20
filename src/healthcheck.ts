import {parseNodeAddr, GameNode} from './util';
import isReachable from 'is-reachable';
import {presence} from './presence';

async function unregisterNode(node: GameNode) {
  await presence.srem('game-servers', node.id + '/' + node.address);
}

async function healthCheck(nodeAddr: string) {
  const node = parseNodeAddr(nodeAddr);
  const online = await isReachable(node.address);
  if (!online) {
    await unregisterNode(node);
    console.info("Removed unreachable node ", node.id + '/' + node.address)
  }
}

async function healthCheckInterval() {
  const servers = await presence.smembers('game-servers')
  for (let server of servers) {
    healthCheck(server);
  }
}

export function startHealthChecks() {
  setInterval(healthCheckInterval, 10000);
  console.info("Starting health checks on 10s interval")
}
