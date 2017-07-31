"use strict";
/**
 * Created by Derwish (derwish.pro@gmail.com) on 30.07.2017.
 * License: MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
// import { Server, Room, Client } from "../../colyseus";
var express = require("express");
var Monitor = (function () {
    function Monitor(options) {
        var _this = this;
        this.UPDATE_INTERVAL = 1000;
        this.router = express.Router();
        this.server = options.server;
        options.express.use('/monitor', this.router);
        this.router.get('/', function (req, res) {
            res.json({
                registeredRoomsCount: _this.getRegisteredRoomsCount(),
                createdRoomsCount: _this.getCreatedRoomsCount(),
                connectedClientsCount: _this.getConnectedClientsCount(),
            });
        });
        this.router.get('/registered_room', function (req, res) {
            var rooms = _this.getRegisteredRooms();
            res.json(Object.keys(rooms));
        });
        this.router.get('/room', function (req, res) {
            res.json(_this.getCreatedRoomsInfo(req.query.state));
        });
        this.router.get('/room/:id', function (req, res) {
            var room = _this.getCreatedRoomInfo(req.params.id, req.query.state);
            if (!room)
                res.status(404).json(null);
            res.json(room);
        });
        this.router.get('/room/state/:id', function (req, res) {
            var room = _this.getCreatedRoom(req.params.id);
            if (!room)
                res.status(404).json(null);
            res.json(room.state);
        });
        this.router.get('/client', function (req, res) {
            res.json(_this.getConnectedClients());
        });
        // this.startMonitoring();
    }
    // startMonitoring() {
    //     setInterval(() => {
    //         console.log("Registered rooms " + this.getRegisteredRoomsCount())
    //         console.log("Created rooms " + this.getCreatedRoomsCount())
    //         console.log("Connected clients " + this.getConnectedClientsCount())
    //     }, this.UPDATE_INTERVAL)
    // }
    Monitor.prototype.getRegisteredRoomsCount = function () {
        return Object.keys(this.getRegisteredRooms()).length;
    };
    Monitor.prototype.getRegisteredRooms = function () {
        return this.server.matchMaker.handlers;
    };
    Monitor.prototype.getCreatedRoomsCount = function () {
        return Object.keys(this.getCreatedRooms()).length;
    };
    Monitor.prototype.getCreatedRooms = function () {
        return this.server.matchMaker.roomsById;
    };
    Monitor.prototype.getCreatedRoom = function (roomId) {
        return this.server.matchMaker.roomsById[roomId];
    };
    Monitor.prototype.getCreatedRoomsInfo = function (includeState) {
        var _this = this;
        if (includeState === void 0) { includeState = false; }
        var rooms = this.getCreatedRooms();
        var infos = [];
        Object.keys(rooms).forEach(function (key) {
            infos.push(_this.getCreatedRoomInfo(+key, includeState));
        });
        return infos;
    };
    Monitor.prototype.getCreatedRoomInfo = function (roomId, includeState) {
        if (includeState === void 0) { includeState = false; }
        var room = this.getCreatedRoom(roomId);
        if (!room)
            return null;
        var info = {
            roomId: room.roomId,
            options: room.options,
            roomName: room.roomName,
            // state: room.state,   
            clients: room.clients.map(function (c) { return c.id; })
        };
        if (includeState)
            info.state = room.state;
        return info;
    };
    Monitor.prototype.getConnectedClientsCount = function () {
        return this.getConnectedClients().length;
    };
    Monitor.prototype.getConnectedClients = function () {
        var rooms = this.getCreatedRooms();
        var clients = [];
        Object.keys(rooms).forEach(function (key) {
            var room = rooms[key];
            room.clients.forEach(function (c) {
                var info = {
                    id: c.id,
                    roomId: room.roomId,
                    roomName: room.roomName
                };
                clients.push(info);
            });
        });
        return clients;
    };
    return Monitor;
}());
exports.Monitor = Monitor;
//# sourceMappingURL=Monitor.js.map