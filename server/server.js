import express from 'express';
import dotenv from 'dotenv';
import * as socketIO from 'socket.io';
import http from 'http';
import {dirname, join} from 'path';
import {fileURLToPath} from 'url';
import {generateMessage} from "./utils/message.js";
import {isRealString} from "./utils/validation.js";
import {Users} from "./utils/users.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

const server = http.createServer(app);
const io = new socketIO.Server(server);


const __dirname = dirname(fileURLToPath(import.meta.url));
const clientPath = join(__dirname, '../client');

let users = new Users;

app.use(express.static(clientPath));

io.on('connection', (socket) => {
    console.log('new user Connected');

    socket.on('join', (params, callback) => {
        if (!isRealString(params.name) || !isRealString(params.room)) {
            return callback('Name and room name are required.');
        }
        socket.join(params.room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUserList', users.getUserList((params.room)));

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat App'));
        socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', `${params.name} has joined`));
        callback();
    });


    socket.on('createMessage', (msg, cb) => {
        let user = users.getUser(socket.id);

        if (user && isRealString(msg.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, msg.text));
        }
        cb();
    });

    socket.on('disconnect', () => {
        console.log('Disconnect from client');
        let user = users.removeUser(socket.id);

        if (user) {
            io.to(user.room).emit('updateUserList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`))
        }
    });
});


server.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} on port ${PORT}`));