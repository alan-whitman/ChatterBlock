module.exports = {
    async joinChannel(db, socket, connectUsers, channel) {
        if (socket.request.session.user) {
            const { id: userId } = socket.request.session.user;
            const channelId = await db.channels.getChannelIdByName(channel);
            const time = Date.now()
            const lastViewTime = db.getLastViewTime(userId, channelId, time);
        }
        const existingMessages = await db.getChannelMessages
        socket.join(channel);

    }
}