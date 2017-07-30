/**
 * Created by Derwish (derwish.pro@gmail.com) on 30.07.2017.
 * License: MIT
 */

import { Server, Room, Client } from "../colyseus";
import * as express from 'express';


export interface IMonitorOptions {
    server: Server;
    express: any;
}
export interface IRoomInfo {
    roomId?: number;
    roomName?: string;
    clients?: Client[];
    options?: any;
    state?: any;
}

export interface IClientInfo {
    id?: string;
    roomId?: number;
    roomName?: string;
}

export class Monitor {
    protected server: Server;
    protected UPDATE_INTERVAL = 1000;
    protected router = express.Router();

    constructor(options: IMonitorOptions) {
        this.server = options.server;

        options.express.use('/monitor', this.router);

        this.router.get('/', (req, res) => {
            res.json({
                registeredRoomsCount: this.getRegisteredRoomsCount(),
                createdRoomsCount: this.getCreatedRoomsCount(),
                connectedClientsCount: this.getConnectedClientsCount(),
            });
        });

        this.router.get('/registered_rooms', (req, res) => {
            var rooms = this.getRegisteredRooms();
            res.json(Object.keys(rooms));
        });

        this.router.get('/rooms', (req, res) => {
            res.json(this.getCreatedRoomsInfo(req.query.state));
        });

        this.router.get('/room/:id', (req, res) => {
            var room = this.getCreatedRoomInfo(req.params.id, req.query.state);
            if (!room) res.status(404).json(null);
            res.json(room);
        });

        this.router.get('/room/state/:id', (req, res) => {
            var room = this.getCreatedRoom(req.params.id);
            if (!room) res.status(404).json(null);
            res.json(room.state);
        });

        this.router.get('/clients', (req, res) => {
            res.json(this.getConnectedClients());
        });

        this.startMonitoring();
    }

    startMonitoring() {
        setInterval(() => {
            console.log("Registered rooms " + this.getRegisteredRoomsCount())
            console.log("Created rooms " + this.getCreatedRoomsCount())
            console.log("Connected clients " + this.getConnectedClientsCount())
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

    getCreatedRoom(roomId: number): Room<any> {
        return this.server.matchMaker.roomsById[roomId];
    }

    getCreatedRoomsInfo(includeState = false): { [name: number]: Room<any> } {
        let rooms = this.getCreatedRooms();
        let infos = [];

        Object.keys(rooms).forEach(key => {
            infos.push(this.getCreatedRoomInfo(+key, includeState));
        });

        return infos;
    }

    getCreatedRoomInfo(roomId: number, includeState = false): IRoomInfo {
        let room = this.getCreatedRoom(roomId);

        if (!room)
            return null;

        let info: IRoomInfo = {
            roomId: room.roomId,
            options: room.options,
            roomName: room.roomName,
            // state: room.state,   
            clients: room.clients
        };

        if (includeState)
            info.state = room.state;

        return info;
    }

    getConnectedClientsCount(): number {
        return this.getConnectedClients().length;
    }

    getConnectedClients(): Client[] {
        let rooms = this.getCreatedRooms();
        let clients = [];

        Object.keys(rooms).forEach(key => {
            let room: Room<any> = rooms[key];
            clients = clients.concat(room.clients)
        });
        return clients;
    }
}



