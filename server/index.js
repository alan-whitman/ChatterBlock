const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const massive = require('massive');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http, {pingTimeout: 15000});


require('dotenv').config();
const { CONNECTION_STRING, SERVER_PORT, SECRET} = process.env


//Controllers 

const Auth = require('./controllers/Auth')
const Channel = require('./controllers/Channels')
const Friend = require('./controllers/Friends')
const DM = require('./controllers/DirectMessages')
const Profile = require('./controllers/Profile')
const Search = require('./controllers/Search')

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log('db connected!')
}) 

app.use(express.static(`${__dirname}/../build`));

app.use(bodyParser.json());

const sessionMiddleware = session({
    secret: SECRET,
    resave: true,
    saveUninitialized: false
});

app.use(sessionMiddleware);


io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
})


//Auth
    app.post('/auth/register', Auth.register)
    // Login to account
    app.post('/auth/login', Auth.login)
    // // Logout of account
    app.get('/auth/logout', Auth.logout)
    // // Get account information
    app.get('/auth/currentUser', Auth.getCurrentUser)
    // // Update account information
    app.put('/auth/update/:id', Auth.update)

//Friend Management
    // Send Friend Request
    app.post('/api/friend/request', Friend.requestFriend)
    // Get Friend Requests for user
    app.get('/api/friend/getRequests', Friend.getRequests)
    // Accept Friend Request
    app.post('/api/friend/acceptRequest', Friend.acceptRequest)
    // Get Friends for user
    // app.get('/api/friend/getUserFriends', Friend.getUserFriends)
    // Delete Friend (deactivate)

//Channel Actions
    // Get all Channels
    app.get('/api/channel/getChannels', Channel.getChannels);

    app.get('/api/channel/all', Channel.getAllChannels)
    // Get all subscribed channels for user
    app.get('/api/channel/all/subscribed', Channel.getAllSubscribedChannels)
    // Get all subscribed channels for user  and unseen message count
    app.get('/api/channel/all/subscribed/message/count', Channel.getAllSubscribedChannelMessageCount)
    // Create Channel
    app.post('/api/channel/new', Channel.createChannel)
    // Get Channel
    app.get('/api/channel', Channel.getChannel)
    // Get Channel and Messages
    app.get('/api/channel/messages/:channel_name', Channel.getChannelWithMessages)
    // Add Channel Message
    app.post('/api/channel/message/new', Channel.createMessage)
    // Follow Channel
    app.post('/api/channel/follow/:channel_id', Channel.followChannel)
    // Unfollow Channel
    app.delete('/api/channel/unfollow/:channel_id', Channel.unfollowChannel)
    // Edit Channel Message
    // Delete Channel Message
    // React to Channel Message

//Private Message Actions
    app.get('/api/dm/getActiveDms', DM.getActiveDms)
    app.delete('/api/dm/hideDm/:dmPartnerId', DM.hideDm);

//Search

//Profile
    // Get profile
    app.get('/api/profile/:id', Profile.getUserProfile)
//Analytics


//Sockets

const sfc = require('./socket_controllers/friendsController');
const scc = require('./socket_controllers/channelController');
const sdmc = require('./socket_controllers/directMessageController');

let connectedUsers = {};
let clientLookupDictionary = {};

io.on('connection', socket => {

    // console.log('client connected');
    const db = app.get('db');
    if (socket.request.session.user) {
        connectedUsers[socket.request.session.user.id] = socket.id;
        clientLookupDictionary[socket.id] = socket.request.session.user.id
        sfc.comingOnline(db, io, connectedUsers, socket.request.session.user.id)
    }

    // friends listeners
    socket.on('get my friends', () => sfc.getMyFriends(db, socket, connectedUsers));
    socket.on('request friend', username => sfc.requestFriend(db, io, socket, connectedUsers, username));
    socket.on('get pending friend requests', () => sfc.getPendingFriendRequests(db, socket));
    socket.on('accept friend', requester => sfc.acceptFriend(db, io, socket, connectedUsers, requester));
    socket.on('reject friend', requester => sfc.rejectFriend(db, io, socket, connectedUsers, requester));
    socket.on('delete friend', friend => sfc.deleteFriend(db, io, socket, connectedUsers, friend));

    // channel listeners
    socket.on('join channel', channelName => scc.joinChannel(db, io, socket, clientLookupDictionary, channelName));
    socket.on('leave channel', () => scc.leaveChannel(socket));
    socket.on('create message', message => scc.createMessage(db, socket, io, connectedUsers, message));
    socket.on('subscribe to channel', channelId => scc.subscribeToChannel(db, socket, io, channelId));
    socket.on('unsubscribe from channel', channelId => scc.unsubscribeFromChannel(db, socket, io, channelId));
    socket.on('create new channel', newChannel => scc.createNewChannel(db, socket, io, newChannel));
    socket.on('react to message', (messageId, channelId, reactionName) => scc.reactToMessage(db, socket, io, messageId, channelId, reactionName));

    socket.on('is typing', () => scc.isTyping(socket));
    socket.on('stopped typing', () => scc.stoppedTyping(socket));

    // private message listeners
    socket.on('join direct message', username => sdmc.joinDm(db, io, socket, connectedUsers, username));
    socket.on('send direct message', (message, receiverId) => sdmc.sendDm(db, io, socket, message, receiverId, connectedUsers));

    // update last view time when channel component unmounts


    socket.on('disconnect', () => {
        // console.log('user disconnecting: ', clientLookupDictionary[socket.id]);
        if (socket.request.session.user) {
            sfc.goingOffline(db, io, connectedUsers, socket.request.session.user.id);
            if (socket.request.session.currentRoom) {
                socket.to(socket.request.session.currentRoom).emit('user left channel', socket.request.session.user.username);
                socket.leave(socket.request.session.currentRoom);
            }
            delete connectedUsers[socket.request.session.user.id];
            delete clientLookupDictionary[socket.id];
        }
    })
});

http.listen(SERVER_PORT, () => {
    console.log(`listening on port: ${SERVER_PORT}`)
});
