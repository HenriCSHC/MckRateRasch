const fs = require('fs').promises;
const path = require('path');
const http = require('http');
const ws = require('ws');
const { v4: uuidv4 } = require('uuid');

import { Room, User } from "./Room";
import { WsMsg } from "./Types";

const host = 'localhost';
const port = 8008;

const requestListener = (_req, _res) => {
    if (_req.method === 'GET') {
        let _path = path.join(__dirname, "www");
        if (_req.url === '/') {
            _path = path.join(_path, "index.html");
        } else {
            _path = path.join(_path, _req.url);
        }
        fs.readFile(_path).then(_contents => {
            _res.writeHead(200);
            _res.end(_contents);
        }).catch(_err => {
            _res.writeHead(404);
            _res.end(_err);
            return;
        });
    }
};

let sockets: Map<string, any> = new Map<string, any>();
let rooms: Map<string, Room> = new Map<string, Room>();

const server = http.createServer(requestListener);
const wss = new ws.Server({ server });

function AddSocket(_socket: any): string {
    let _id = uuidv4();
    sockets[_id] = {
        socket: _socket,
        room: ""
    };
    return _id;
}

function EnterRoom(roomName: string, socketId: string): void {
    let _id: string | undefined = undefined;
    Object.entries(rooms).forEach((_r: [string, Room]) => {
        if (_r[1].name === roomName)
        {
            _id = _r[0];
        }
    });

    if (_id === undefined) {
        _id = uuidv4();
        rooms[_id] = new Room();
        rooms[_id].name = roomName;
    }

    let _msg = new WsMsg();
    _msg.type = "data";
    _msg.section = "room";
    _msg.data = rooms[_id];

    sockets[socketId].socket.send(JSON.stringify(_msg));
}

wss.on('connection', _socket => {
    let _id = AddSocket(_socket);

    _socket.on('message', (_tmp: string) => {
        let _msg: WsMsg = JSON.parse(_tmp);
        console.log(`New msg from ${_id}: ${_msg}`)

        switch(_msg.section) {
            case "room": {
                switch (_msg.type) {
                    case "enter":
                        EnterRoom(_msg.data, _id);
                        break;
                    case "addUser":
                        break;
                    case "removeUser":
                        break;
                    default:
                        break;
                }
                break;
            }
            default:
                break;
        }
    });

    _socket.on('close', () => {
        console.log(`Socket ${_id} was closed!`);
        delete sockets[_id];
    });

    _socket.send("Hello Frontend!");

    console.log(`New Socket ${_id}`);
});

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});

console.log(`[DIR]: ${__dirname}`);