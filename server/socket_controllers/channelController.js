module.exports = {
    async joinChannel(db, io, socket, connectedUsers, clientLookupDictionary, channelName) {
        try {
            let response = await db.channels.getChannelIdByName(channelName);
            if (!response[0])
                return console.log('channel doesn\'t exist');
            let initialChannelResponse = {};
            const channelId = response[0].id;
            const name = response[0].channel_name
            if (socket.request.session.user) {
                const { id: myId } = socket.request.session.user;
                const time = Date.now()
                const lastViewTime = await db.channels.getUpdateLastViewTime(myId, channelId, time);
                initialChannelResponse.lastViewTime = lastViewTime[0] ? lastViewTime[0].last_view_time : Date.now();
                socket.request.session.currentRoom = channelName;
            }
            initialChannelResponse.existingMessages = await db.channels.getChannelMessages(channelId);
            initialChannelResponse.channelId = channelId;
            initialChannelResponse.channelName = name;
            socket.join(channelName);
            let usersInChannel;
            io.in(channelName).clients(async (err, clients) => {
                // get list of online users in the channel, filter out ones who are not in clientDictionary, and therefore are guests and won't be displayed
                usersInChannel = clients.map(client => clientLookupDictionary[client])
                usersInChannel = usersInChannel.filter(user => user);
                // get user data for them, filtering out everything except username and id
                if (usersInChannel[0]) {
                    let userList = await db.users.find({ id: usersInChannel })
                    onlineUsers = userList.map(user => { return { id: user.id, username: user.username } }).sort((a, b) => a.username < b.username ? -1 : 1)
                } else {
                    onlineUsers = [];
                }
                // get user data for all channel subscribers
                let subbedUsers = await db.channels.getChannelUsers(channelId);
                // console.log(subbedUsers);
                // set there subbed status to true on return object, and online status by reconciling with usersInChannel
                let users = subbedUsers.map(user => {
                    user.subbed = true;
                    user.online = usersInChannel.indexOf(user.id) === -1 ? false : true;
                    return user;
                });
                // push online users onto array if they aren't there already, setting subbed status to false since they weren't in the previous block
                for (let i = 0; i < onlineUsers.length; i++) {
                    if (users.findIndex(user => user.id === onlineUsers[i].id) === -1)
                        users.push({ ...onlineUsers[i], online: true, subbed: false })
                }
                initialChannelResponse.users = users;
                socket.emit('send initial response', initialChannelResponse);
                if (socket.request.session.user) {
                    const mySubStatus = subbedUsers.findIndex(user => user.id === socket.request.session.user.id) === -1 ? false : true;
                    socket.to(channelName).emit('user joined channel', {
                        username: socket.request.session.user.username,
                        id: socket.request.session.user.id,
                        subbed: mySubStatus,
                        online: true
                    });
                }
            });

        } catch (err) {
            console.log(err);
        }
    },
    async createMessage(db, socket, message) {
        if (!socket.request.session.user)
            return;
        const { id: myId, username: myUsername } = socket.request.session.user;
        const { currentRoom } = socket.request.session;
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
            // console.log(username, ' - is leaving - ', currentRoom);
            socket.to(currentRoom).emit('user left channel', username);
        }
        socket.leave(currentRoom);
        delete socket.request.session.currentRoom;
    },
    async isTyping(socket) {
        const { currentRoom } = socket.request.session;
        if (socket.request.session.user) {
            const { username } = socket.request.session.user;
            socket.to(currentRoom).emit('is typing', username);
        }
    },
    async stoppedTyping(socket) {
        const { currentRoom } = socket.request.session;
        if (socket.request.session.user) {
            const { username } = socket.request.session.user;
            // console.log(username, '- stopped typing -', currentRoom);
            socket.to(currentRoom).emit('stopped typing', username);
        }
    },
    async subscribeToChannel(db, socket, io, channelId) {
        try {
            if (!socket.request.session.user)
                return;
            const { id: myId, username: myUsername } = socket.request.session.user;
            const timeStamp = Date.now();
            const response = await db.channels.subAndGetName(channelId, myId, timeStamp);
            const roomName = response[0].channel_url;
            const user = {
                username: myUsername,
                id: myId,
                subbed: true,
                online: false
            }
            io.in(roomName).emit('user subbed to channel', user);
            socket.emit('successfully subbed to channel', response[0]);
        } catch(err) {
            console.log(err);
        }
    }
   
}