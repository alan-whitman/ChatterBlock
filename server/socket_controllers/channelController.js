module.exports = {
    async joinChannel(db, io, socket, connectedUsers, clientLookupDictionary, channelName) {
        try {
            let response = await db.channels.getChannelIdByName(channelName);
            if (!response[0])
                return console.log('channel doesn\'t exist');
            let initialChannelResponse = {};
            const channelId = response[0].id;
            if (socket.request.session.user) {
                const { id: userId } = socket.request.session.user;
                const time = Date.now()
                const lastViewTime = await db.channels.getUpdateLastViewTime(userId, channelId, time);
                initialChannelResponse.lastViewTime = lastViewTime[0] ? lastViewTime[0].last_view_time : Date.now();
                socket.request.session.currentRoom = channelName;
            }
            initialChannelResponse.existingMessages = await db.channels.getChannelMessages(channelId);
            initialChannelResponse.channelId = channelId;
            socket.join(channelName);
            let usersInChannel;
            await io.in(channelName).clients(async (err, clients) => {
                usersInChannel = clients.map(client => clientLookupDictionary[client]).filter(user => user);
                console.log(usersInChannel);
                if (usersInChannel[0]) {
                    let userList = await db.users.find({id: usersInChannel})
                    initialChannelResponse.channelUsers = userList.map(user => {return {id: user.id, username: user.username}}).sort((a, b) => a.username < b.username ? -1 : 1)
                } else {
                    initialChannelResponse.channelUsers = [];
                }
                socket.emit('send initial response', initialChannelResponse);
                if (socket.request.session.user)
                    socket.to(channelName).emit('user joined channel', {username: socket.request.session.user.username, id: socket.request.session.user.id});
            });

        } catch(err) {
            console.log(err);
        }
    },
    async createMessage(db, socket, message) {
        if (!socket.request.session.user)
            return;
        const { id: myId, username: myUsername } = socket.request.session.user;
        const { currentRoom }  = socket.request.session;
        const timestamp = Date.now();
        await db.channels.createMessage(message.channelId, myId, message.contentText, null, timestamp);
        const outgoingMessage = {
            content_text: message.contentText,
            content_image: null,
            time_stamp: timestamp,
            username: myUsername,
            user_image: null
        }
        socket.to(currentRoom).emit('new message', outgoingMessage);
    },
    async leaveChannel(socket) {
        const { currentRoom } = socket.request.session;
        if (socket.request.session.user) {
            const { username } = socket.request.session.user;
            console.log(username, ' - is leaving - ', currentRoom);
            socket.to(currentRoom).emit('user left channel', username);
        }
        socket.leave(currentRoom);
        delete socket.request.session.currentRoom;
    }
}