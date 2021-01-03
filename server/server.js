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
        from: 'Admin',
        text: 'Welcome to the chat App',
        createdAt: new Date().getTime()
    });

    socket.broadcast.emit('newMessage', {
        from: 'Admin',
        text: 'New user Join',
        createdAt: new Date().getTime()
    });

    socket.broadcast.emit('Admin', {
        from: 'Greeting new User'
    });


    socket.on('createMessage', (msg) => {
        console.log('create Message', msg);
        io.emit('newMessage', {
            createdAt: new Date().getTime(),
            from: msg.from,
            text: msg.text
        })
    });

    socket.on('disconnect', () => {
        console.log('Disconnect from client');
    });
});


server.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} on port ${PORT}`));