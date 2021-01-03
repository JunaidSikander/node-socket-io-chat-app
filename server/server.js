import express from 'express';
import dotenv from 'dotenv';
import * as socketIO from 'socket.io';
import http from 'http';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

const server = http.createServer(app);
const io = new socketIO.Server(server);


const __dirname = dirname(fileURLToPath(import.meta.url));
const clientPath = join(__dirname, '../client');

app.use(express.static(clientPath));

io.on('connection', (socket) => {
    console.log('new user Connected');

    socket.emit('newMessage', {
        createdAt: 12345,
        from: 'Moin',
        text: "Hello there..."
    });

    socket.on('createMessage', (msg) => {
        console.log('create Message', msg)
    });

    socket.on('disconnect', () => {
        console.log('Disconnect from client');
    });
});


server.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} on port ${PORT}`));