document.addEventListener("DOMContentLoaded", function() {
    var socket = io(''),
        form = $('#room form'),
        ul = $('#message-list'),
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
        .on('join', function (user) {
            setStatus(user, true);
        })
        .on('users', function (users, rooms) {
            drawUserList(users, rooms);
        })
        .on('leave', function (user) {
            setStatus(user, false);
        })
        .on('error', function (reasons) {
            if(reasons == 'handshake unauthorized'){
                printMessage('You lo-out from this chat');
            }
        })
        .on('logout', function () {
            window.location.href = '/';
        });

    function printMessage(text) {
        ul.append($('<li/>', {text: text}));
    }

    function sendMessage(e) {
        e.preventDefault();
        var text = input.val();

        socket.emit('message', text, function () {
            ul.append($('<li/>', {text:'my: ' + text}));
            input.val('');
        });
        return false
    }

    function setStatus(user, status) {
        var $elem = $('#' + user._id);
        $elem.toggleClass('online', status);
    }

    function drawUserList(users, rooms) {
        var $list = $('.list-group'),
            online = Object.keys(rooms),
            className = 'list-group-item';

        $list.html('');
        for (var i = 0; i < users.length; i++) {
            var user = users[i],
                $badge = $('<span/>', {text: '0', class: 'badge'}),
                $itemElem = $('<a/>', {
                    text: user.username,
                    class: className,
                    id: user._id
                });

            online.indexOf(user._id) != -1 && $itemElem.addClass('online');
            $itemElem.append($badge);
            $list.append($itemElem)
        }
    }
});
