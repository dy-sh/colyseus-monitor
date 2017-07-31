export interface IMonitorOptions {
    server: any;
    express: any;
}
export interface IRoomInfo {
    roomId?: number;
    roomName?: string;
    clients?: string[];
    options?: any;
    state?: any;
}
export interface IClientInfo {
    id?: string;
    roomId?: number;
    roomName?: string;
}
export declare class Monitor {
    protected server: any;
    protected UPDATE_INTERVAL: number;
    protected router: any;
    constructor(options: IMonitorOptions);
    getRegisteredRoomsCount(): number;
    getRegisteredRooms(): {
        [id: string]: any[];
    };
    getCreatedRoomsCount(): number;
    getCreatedRooms(): {
        [name: number]: any;
    };
    getCreatedRoom(roomId: number): any;
    getCreatedRoomsInfo(includeState?: boolean): {
        [name: number]: any;
    };
    getCreatedRoomInfo(roomId: number, includeState?: boolean): IRoomInfo;
    getConnectedClientsCount(): number;
    getConnectedClients(): IClientInfo[];
}
