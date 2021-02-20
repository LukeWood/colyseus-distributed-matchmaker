import { RedisPresence } from 'colyseus';
import { MongooseDriver } from "colyseus/lib/matchmaker/drivers/MongooseDriver";
interface JoinOrCreateRequest {
    body: {
        roomName?: string;
    };
}
export declare function joinOrCreate(driver: MongooseDriver, presence: RedisPresence): (req: JoinOrCreateRequest, res: any) => Promise<any>;
export {};
