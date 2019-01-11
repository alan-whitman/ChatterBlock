module.exports = {
    async getMyFriends(db, socket, connectedUsers) {
        try {
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
        } catch (err) {
            console.log(err);
        }
    },
    async goingOffline(db, io, connectedUsers, id) {
        try {
            const friends = await db.getMyFriends(id);
            if (friends[0]) {
                const onlineFriends = friends.filter(friend => connectedUsers[friend.id]);
                onlineFriends.forEach(friend => {
                    io.to(connectedUsers[friend.id]).emit('friend went offline', id);
                });
            }
        } catch (err) {
            console.log(err);
        }
    },
    async comingOnline(db, io, connectedUsers, id) {
        try {
            let friends = await db.getMyFriends(id);
            if (friends[0]) {
                const onlineFriends = friends.filter(friend => connectedUsers[friend.id]);
                onlineFriends.forEach(friend => {
                    io.to(connectedUsers[friend.id]).emit('friend came online', id);
                });
            }
        } catch (err) {
            console.log(err);
        }
    },
    async requestFriend(db, io, socket, connectedUsers, username) {
        try {
            const { id: myId, username: myUsername } = socket.request.session.user;
            const response = await db.getUserByUsername(username);
            const requestee = response[0];
            if (requestee.id === myId)
                return socket.emit('confirm friend request', 'you can\'t be friends with yourself');
            if (!requestee)
                return socket.emit('confirm friend request', 'user not found');
            const existingFriendRelationship = await db.getFriendRelationship([myId, requestee.id]);
            if (existingFriendRelationship[0])
                return socket.emit('confirm friend request', 'friend relationship already exists');
            const existingRequest = await db.getFriendRequestById([myId, requestee.id]);
            if (existingRequest[0])
                return socket.emit('confirm friend request', 'friend request already exists');
            await db.createFriendRequest([myId, requestee.id]);
            if (connectedUsers[requestee.id])
                io.to(connectedUsers[requestee.id]).emit('pending friend request', {myUsername, myId});
            return socket.emit('confirm friend request', 'friend request submitted');
        } catch (err) {
            console.log(err);
        }
    },
    async getPendingFriendRequests(db, io, socket, connectedUsers) {
        try {
            const { id: myId, username: myUsername } = socket.request.session.user;
            const pendingRequests = await db.getPendingFriendRequests(myId);
            if (!pendingRequests[0])
                return socket.emit('send pending requests', 'no requests pending');
            else {
                return socket.emit('send pending requests', pendingRequests);
            }
        } catch(err) {
            console.log(err);
        }
    }
}