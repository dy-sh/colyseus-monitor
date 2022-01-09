This library allows to monitor colyseus server using the REST API or [colyseus-cli](https://www.npmjs.com/package/colyseus-cli).

All requests are available on route /monitor.  For example, to get the state of a room id 0, 
make a GET request to `http://localhost:2657/monitor/room/state/0`


## How to use
 
```js
import * as express from 'express';  
import * as http from 'http';  
import { Server } from 'colyseus';  
import { Monitor } from 'colyseus-monitor';  

// Require ChatRoom handler  
import { GameRoom } from "./rooms/gameRoom";  
import { LobbyRoom } from "./rooms/lobbyRoom";


const port = process.env.PORT || 2657;  
const app = express();

// Create HTTP Server  
let httpServer = http.createServer(app);

// Attach WebSocket Server on HTTP Server.  
const gameServer = new Server({ server: httpServer });

// Register rooms  
gameServer.register("lobby", LobbyRoom);  
gameServer.register("game", GameRoom);

// Attach monitor  
const monitor = new Monitor({ server: gameServer, express: app });

httpServer.listen(port);

console.log('Server started: https://localhost:'+port});
```



## API:

Get all registered rooms names: 

`GET /monitor/registered_room`  

Get all created rooms:   

`GET /monitor/room`   

`?state=true` - include rooms states  

Get created room by id:  

`GET /monitor/room/0` 

`?state=true` - include room state  

Get created room state by id:  

`GET /monitor/room/state/0`   

Get all connected clients: 

`GET /monitor/client`  
