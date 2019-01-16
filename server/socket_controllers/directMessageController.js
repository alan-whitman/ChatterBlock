module.exports = {
    async joinDm(db, io, socket, connectedUsers, username) {
        try {
            if (!socket.request.session.user)
                return console.log('can\'t send dms if you\'re not logged in');
            if (username === socket.request.session.user.username)
                return console.log('can\'t talk to yourself');
            const { id: myId, username: myUsername } = socket.request.session.user;
            let dmPartner = await db.getUserByUsername(username);
            if (!dmPartner[0])
                return socket.emit('send initial dm response', -1);
            dmPartner = dmPartner[0];
            let existingMessages = await db.dm.getDirectMessages(myId, dmPartner.id);
            existingMessages = existingMessages.map(message => {
                return {
                    content_text: message.content_text,
                    sender: message.sender_id === myId ? myUsername : dmPartner.username
                }
            });
            let initialResponse = {};
            initialResponse.existingMessages = existingMessages;
            initialResponse.dmPartner = {
                username: dmPartner.username,
                id: dmPartner.id
            };
            socket.emit('send initial dm response', initialResponse);
        } catch(err) {
            console.log(err);
        }
    },
    async sendDm(db, io, socket, message, receiverId, connectedUsers) {
        try {
            if (!socket.request.session.user)
                return console.log('can\'t send dms if you\'re not logged in');
            const { id: myId, username: myUsername } = socket.request.session.user;
            await db.dm.createDirectMessage(myId, receiverId, message, Date.now());
            const outgoingMessage = {
                sender: myUsername,
                content_text: message
            }
            if (connectedUsers[receiverId])
                io.to(connectedUsers[receiverId]).emit('relay direct message', outgoingMessage);
        } catch(err) {
            console.log(err);
        }
    }
}