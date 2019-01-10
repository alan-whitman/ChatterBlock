module.exports = {
    async getMyFriends(db, socket, connectedUsers) {
        const friends = await db.getMyFriends(socket.request.session.user.id);
        if (friends[0]) {
            friends.forEach(friend => {
                if (connectedUsers[friend.id])
                    friend.online = true;
                else
                    friend.online = false;
            });
            socket.emit('send your friends', friends);
        } else {
            socket.emit('you have no friends');
        }
    },
    async goingOffline(db, io, connectedUsers, id) {
        const friends = await db.getMyFriends(id);
        if (friends[0]) {
            const onlineFriends = friends.filter(friend => connectedUsers[friend.id]);
            onlineFriends.forEach(friend => {
                io.to(connectedUsers[friend.id]).emit('friend went offline', id);
            });
        }
    },
    async comingOnline(db, io, connectedUsers, id) {
        let friends = await db.getMyFriends(id);
        if (friends[0]) {
            const onlineFriends = friends.filter(friend => connectedUsers[friend.id]);
            onlineFriends.forEach(friend => {
                io.to(connectedUsers[friend.id]).emit('friend came online', id);
            });
        }
    }
}