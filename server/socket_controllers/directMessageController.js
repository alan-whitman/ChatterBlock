module.exports = {
    async joinDm(db, io, socket, connectedUsers, username) {
        try {
            if (!socket.request.session.user)
                return;
            if (username === socket.request.session.user.username)
                return;
            const { id: myId, username: myUsername } = socket.request.session.user;
            let dmPartner = await db.getUserByUsername(username);
            if (!dmPartner[0])
                return socket.emit('send initial dm response', -1);
            dmPartner = dmPartner[0];
            let existingMessages = await db.dm.getDirectMessages(myId, dmPartner.id);
            existingMessages.forEach(message => {
                message.sender = message.sender_id === myId ? myUsername : dmPartner.username;
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
                return;
            const { id: myId, username: myUsername } = socket.request.session.user;
            const newDirectMessage = await db.dm.createDirectMessage(myId, receiverId, message, Date.now());
            newDirectMessage[0].sender = myUsername;
            socket.emit('new direct message', newDirectMessage[0])
            if (connectedUsers[receiverId])
                io.to(connectedUsers[receiverId]).emit('new direct message', newDirectMessage[0]);
        } catch(err) {
            console.log(err);
        }
    }
}