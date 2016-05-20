document.addEventListener("DOMContentLoaded", function() {
    var socket = io(),
        form = $('#room form'),
        ul = $('#room ul'),
        input = $('#room input');

    socket
        .on('message', function (username, message) {
            printMessage(username + '> ' + message);
        })
        .on('connect', function () {
            printMessage('Session connected ...');
            form.on('submit', sendMessage);
            input.prop('disabled', false);
        })
        .on('disconnect', function () {
            printMessage('Session disconnected...');
            input.prop('disabled', true);
            form.off('submit', sendMessage);
        })
        .on('reconnected-_failed', function () {
            alert('Oh Goodness, this connections died for always')
        })
        .on('join', function (username) {
            printMessage(username + ' joined to this chat.');
        })
        .on('leave', function (username) {
            printMessage(username + ' leave this chat.')
        })
        .on('error', function (reasons) {
            if(reasons == 'handshake unauthorized'){
                printMessage('You lo-out from this chat');
            }
        });

    function printMessage(text) {
        ul.append($('<li/>', {text: text}));
    }

    function sendMessage() {
        var text = input.val();

        input.val('');
        socket.emit('message', text, function () {
            ul.append($('<li/>', {text: text}))
        });
        return false
    }
});
