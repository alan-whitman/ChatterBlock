const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const massive = require('massive');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const sharedSession = require('express-socket.io-session');


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

io.use(sharedSession(sessionMiddleware), {autoSave: true})

app.use(sessionMiddleware);


// io.use((socket, next) => {
//     sessionMiddleware(socket.request, socket.request.res, next);
// })


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
    // Get Friend Requests
    // Accept Friend Request
    // Get Friends
    // Delete Friend

//Channel Actions
    // Get all Channels
    app.get('/api/channel/all', Channel.getAllChannels)
    // Create Channel
    app.post('/api/channel/new', Channel.createChannel)
    // Get Channel
    app.get('/api/channel', Channel.getChannel)
    // Get Channel and Messages
    app.get('/api/channel/messages', Channel.getChannelWithMessages)
    // Add Channel Message
    app.post('/api/channel/message/new', Channel.createMessage)
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

io.on('connection', socket => {
    console.log('client connected');
    socket.on('test', () => {
        console.log('session', socket.handshake.session.user)
        // if (socket.request.session.user)
    });
    // socket.on('disconnect', () => console.log('client disconnected'))
});

http.listen(SERVER_PORT, () => {
    console.log(`listening on port: ${SERVER_PORT}`)
});
