let socket = io();

socket.on('connect', function () {
    console.log('Connected to server');
});
socket.on('newMessage', function (msg) {
    let formattedTime = moment(msg.createdAt).format('h:mm a');
    console.log('New message', msg);
    let li = jQuery('<li></li>');
    li.text(`${msg.from} ${formattedTime} : ${msg.text}`);
    jQuery('#messages').append(li);
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    let messageTextbox = jQuery('[name=message]');

    socket.emit('createMessage', {
        from: 'User',
        text: messageTextbox.val()
    }, () => {
        messageTextbox.val('');
    });
});