module.exports = {
    async joinChannel(db, socket, connectedUsers, channelName) {
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
            socket.request.session.user.currentRoom = channelName;
        }
        initialChannelResponse.existingMessages = await db.channels.getChannelMessages(channelId);
        initialChannelResponse.channelId = channelId;
        socket.join(channelName);
        socket.emit('send initial response', initialChannelResponse);
    },
    async createMessage(db, socket, message) {
        console.log(message);
        if (!socket.request.session.user)
            return;
        const { id: myId, username: myUsername, currentRoom } = socket.request.session.user;
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
    }
}