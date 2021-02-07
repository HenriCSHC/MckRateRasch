const fs = require('fs').promises;
const path = require('path');
const http = require('http');
const WebSocket = require('ws');

const host = 'localhost';
const port = 8008;

const requestListener = (_req, _res) => {
    if (_req.method === 'GET') {
        let _path = path.join(__dirname, "gui", "public");
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

const server = http.createServer(requestListener);
const wss = new WebSocket.Server({ server });

wss.on('connection', _socket => {
    console.log('New Connection from' + _socket);

    _socket.on('message', _msg => {
        console.log(`New msg ${_msg}`)
    });

    _socket.send("Hello Frontend!");
});

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});