import express from 'express';
import dotenv from 'dotenv';
import moment from 'moment';
import * as socketIO from 'socket.io';
import http from 'http';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import {generateMessage} from "./utils/message.js";

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


    //new joined user will recieve this msg
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat App'));

    //alert others user who are connected
    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user Join'));

    socket.broadcast.emit('Admin', generateMessage('Admin', 'Greeting new user'));


    socket.on('createMessage', (msg,cb) => {
        console.log('create Message', msg);
        io.emit('newMessage', generateMessage(msg.from, msg.text));
        cb();
    });

    socket.on('disconnect', () => {
        console.log('Disconnect from client');
    });
});


server.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} on port ${PORT}`));