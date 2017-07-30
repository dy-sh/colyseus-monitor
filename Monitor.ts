/**
 * Created by Derwish (derwish.pro@gmail.com) on 30.07.2017.
 * License: MIT
 */

import { Server } from "../colyseus";

export interface IMonitorOptions {
    server: Server;
}

export class Monitor {
    protected server: Server;
    public UPDATE_INTERVAL = 1000;

    constructor(options: IMonitorOptions) {
        this.server = options.server;
        this.startMonitoring();
    }

    startMonitoring() {
        setInterval(() => {
            console.log("Registered rooms " + this.getRegisteredRoomsCount())
        }, this.UPDATE_INTERVAL)
    }

    getRegisteredRoomsCount(): number {
        return Object.keys(this.server.matchMaker.handlers).length;
    }
}