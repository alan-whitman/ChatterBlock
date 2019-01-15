module.exports = {
    async createMessage(db, socket, content_text,sender_id,reciever_id) {
        console.log(message);
        if (!socket.request.session.user)
            return;
        const { id: myId, username: myUsername, currentRoom } = socket.request.session.user;
        const timestamp = Date.now();
        // await db.channels.createMessage(message.channelId, myId, message.contentText, null, timestamp);
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