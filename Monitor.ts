/**
 * Created by Derwish (derwish.pro@gmail.com) on 30.07.2017.
 * License: MIT
 */

import { Server, Room } from "../colyseus";

export interface IMonitorOptions {
    server: Server;
}

export class Monitor {
    protected server: Server;
    protected UPDATE_INTERVAL = 1000;

    constructor(options: IMonitorOptions) {
        this.server = options.server;
        this.startMonitoring();
    }

    startMonitoring() {
        setInterval(() => {
            console.log("Registered rooms " + this.getRegisteredRoomsCount())
            console.log("Created rooms " + this.getCreatedRoomsCount())
        }, this.UPDATE_INTERVAL)
    }

    getRegisteredRoomsCount(): number {
        return Object.keys(this.getRegisteredRooms()).length;
    }

    getRegisteredRooms(): { [id: string]: any[] } {
        return this.server.matchMaker.handlers;
    }

    getCreatedRoomsCount(): number {
        return Object.keys(this.getCreatedRooms()).length;
    }

    getCreatedRooms(): { [name: number]: Room<any> } {
        return this.server.matchMaker.roomsById;
    }
}