const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const massive = require('massive');
require('dotenv').config();
const { CONNECTION_STRING, SERVER_PORT, SECRET} = process.env


//Controllers 


const app = express()

massive(CONNECTION_STRING).then(db => {
    app.set('db', db)
    console.log('db connected!')
  }) 

app.use(bodyParser.json());

app.use(session({
  secret: SECRET,
  resave: true,
  saveUninitialized: false
}))

//Auth
    app.post('/auth/register', Auth.register)
    // Login to account
    app.post('/auth/login', Auth.login)
    // Logout of account
    app.get('/auth/logout', Auth.logout)
    // Get account information
    app.get('/auth/currentUser', Auth.getCurrentUser)
    // Update account information
    app.put('/auth/profile/update/:id', Auth.update)

//Friend Management
    // Send Friend Request
    // Get Friend Requests
    // Accept Friend Request
    // Get Friends
    // Delete Friend

//Channel Actions
    // Get all Channels
    // Create Channel
    // Add Channel Message
    // Edit Channel Message
    // Delete Channel Message
    // Get all Channel Messages
    // React to Channel Message

//Private Message Actions
    // Create Private Message
    // Get Private Messages (between users)
    // Get all Private Messages (for current user)

//Search

//Profile
    // Get profile

//Analytics

app.listen(SERVER_PORT, () => {
console.log(`listening on port: ${SERVER_PORT}`)
})