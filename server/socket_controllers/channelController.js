module.exports = {
    async joinChannel(db, socket, connectedUsers, channelName) {
        console.log('joining channel...')
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
        }
        initialChannelResponse.existingMessages = await db.channels.getChannelMessages(channelId);
        initialChannelResponse.channelId = channelId;
        socket.join(channelName);
        socket.emit('send initial response', initialChannelResponse);

    }
}