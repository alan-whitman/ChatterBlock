const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const massive = require('massive');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


require('dotenv').config();
const { CONNECTION_STRING, SERVER_PORT, SECRET} = process.env


//Controllers 

const Auth = require('./controllers/Auth')
const Channel = require('./controllers/Channels')
const Friend = require('./controllers/Friends')
const Private = require('./controllers/PrivateMessages')
const Profile = require('./controllers/Profile')
const Search = require('./controllers/Search')

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log('db connected!')
  }) 

app.use(bodyParser.json());

const sessionMiddleware = session({
    secret: SECRET,
    resave: true,
    saveUninitialized: false
});

app.use(sessionMiddleware);

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
    // Get Friends for user
    // Delete Friend (deactivate)

//Channel Actions
    // Get all Channels
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
    app.get('/api/channel/messages', Channel.getChannelWithMessages)
    // Add Channel Message
    app.post('/api/channel/message/new', Channel.createMessage)
    // Follow Channel
    app.post('/api/channel/follow', Channel.followChannel)
    // Unfollow Channel
    app.delete('/api/channel/unfollow', Channel.unfollowChannel)
    // Edit Channel Message
    // Delete Channel Message
    // React to Channel Message

//Private Message Actions
    // Create Private Message
    // Get Private Messages (between users)
    // Get all Private Messages (for current user)

//Search

//Profile
    // Get profile

//Analytics




//Sockets

io.use((socket, next) => {
    sessionMiddleware(socket.request, socket.request.res, next);
})

io.on('connection', socket => {
    // console.log('client connected: ', socket.request.session.user);
    socket.on('test', () => {
        console.log(socket.request.session);
    })
    // socket.on('get friend list', session.user.id => {})
});

http.listen(SERVER_PORT, () => {
    console.log(`listening on port: ${SERVER_PORT}`)
})
