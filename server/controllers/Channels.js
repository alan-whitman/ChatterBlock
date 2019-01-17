module.exports = {
    createChannel: async (req,res) => {
        try {
            const db = req.app.get('db')
            if (!req.session.user)
                return console.log('must be logged in to create channel');
            const {channel_name, channel_description} = req.body
            const { id: creator_id } = req.session.user
            
            const reg=/[^a-zA-Z0-9\_\ \|]+/;
            if(reg.test(channel_name)) {
                console.log("Your Channel Cant Have any thing other than a-zA-Z0-9_| and spaces");
                return res.status(508).send("Your Channel Cant Have any thing other than a-zA-Z0-9_| and spaces");
            }

            const channel_url = channel_name.toLowerCase().replace(/ /g, '_');

            let channelResponse = await db.channels.checkChannelNameAndUrl(channel_name, channel_url);
            if (channelResponse[0]) {
                console.log("This channel name or url is in use")
                return res.status(509).send('this channel name or url is in use')
            }

            const length = channel_name.length
            if(length < 4 || length > 20){
                console.log("too short or long")
                return res.status(510).send("too short or long");
            }
            
            console.log('channel passed validation checks');

            let response = await db.createChannel( {channel_name, creator_id, channel_description, channel_url} )
            // database will return the newly created channel
            // console.log(response)
            let newChannel = response[0]
            //send user info back to client
            res.status(200).send(newChannel)
            // console.log(newChannel)


        }catch (error){
            console.log('error creating channel:', error)
            res.status(500).send(error)   
        }
    },
    getChannel: async (req,res) => {
        try {
        // console.log('attemping to get single channel')
        const db = req.app.get('db')

        const {channel_name} = req.body

        let channel = await db.getChannelByName(channel_name)
        res.status(200).send(channel)

        } catch (error) {
        console.log('error getting channel:', error)
        res.status(500).send(error)           
        }
    },
    getAllChannels: async (req,res) => {
        try {
        const db = req.app.get('db')
        
        let channels =await db.getAllChannels()
        res.status(200).send(channels)

        }catch (error){
        console.log('error getting all channels:', error)
        }
    },
    getAllSubscribedChannels: async (req,res) => {
        try {
        const db = req.app.get('db')
        const {user_id} = req.body
        // console.log("user id: ", user_id)
        let channels =await db.getAllSubscibedChannels(user_id)
        res.status(200).send(channels)

        }catch (error){
        console.log('error getting all subscribed channels:', error)
        }
    },
    getAllSubscribedChannelMessageCount: async (req,res) => {
        try {
            const db = req.app.get('db')
            if (!req.session.user)
                return res.send([]);
            const {id: user_id} =req.session.user
            let channels = await db.getAllSubscibedChannels(user_id)
            var newChannels = []

            //Loop over Channels array
            if(channels.length === 0){
                res.status(200).send([])
            }
            await channels.map(async channel => {
                try{
                // use this later    
                function addCount(num){
                    channel.count = num
                    newChannels.push(channel)
                    if(newChannels.length === channels.length){
                        res.status(200).send(newChannels)
                    }
                }

                // Convert last view time to int
                let time = parseInt(channel.last_view_time)
                // Go back to db and count the number of messages more recent than users last view for each 
                let messageCount = await db.getAllSubscribedChannelMessageCount(time,channel.id)

                addCount(messageCount[0].count)

                }catch (error){
                    console.log('error returning subscribed channel message count',error)
                }
            })

        }catch (error){
            console.log('error getting all subscribed channels and count', error)

        }
    },


    // Might need to break out update view time so it can be hit on unmount too
    // THis might be breaking something else - but it's working
    getChannelWithMessages: async (req,res) => {
        try {

        const db = req.app.get('db')
        // console.log(req.body)
        const {channel_name} = req.params
        const user_id = req.session.user.id
        let time = Date.now()
        let channelFull = await db.getChannelWithMessages(channel_name)
        // console.log(channel_name,user_id,time)
        // db.updateChannelViewTime({channel_id,user_id,time})
        res.status(200).send(channelFull)
        } catch (error){
        console.log('error getting channel', error)
        }
    },
    // getChannelWithMessages: async (req,res) => {
    //     try {

    //     const db = req.app.get('db')
    //     const {channel_id,user_id} = req.body
    //     let time = Date.now()
    //     let channelFull = await db.getChannelWithMessages(channel_id)
    //     // console.log(channel_id,user_id,time)
    //     db.updateChannelViewTime({channel_id,user_id,time})
    //     res.status(200).send(channelFull)
    //     } catch (error){
    //     console.log('error getting channel', error)
    //     }
    // },
    createMessage: async (req, res) => {
        try {
        // console.log("attemping to add channel message", req.body)
        const db = req.app.get('db')
        let time_stamp = Date.now()
        const {channel_id, user_id, content_text, content_image} = req.body
        // console.log("attemping to add channel message",channel_id, user_id, content_text, content_image, time_stamp)

        let newMessage = await db.createChannelMessage({channel_id, user_id, content_text, content_image, time_stamp})
        res.status(200).send(newMessage)
        } catch (error){
            console.log('error creating new message',  error)
        }
    },
    // Follow Channel
    followChannel: async (req, res) => {
        try {
        const db = req.app.get('db')
        const {channel_id, user_id} = req.body
        let time_stamp = Date.now()
        // console.log(`${user_id} attemping to follow ${channel_id}`)
        
        let channelFollow = await db.followChannel({channel_id, user_id, time_stamp})
        res.status(200).send(channelFollow)
        }catch (error){
            console.log('error following Channel',  error)
        }
    },
        // Unfollow Channel
    unfollowChannel: async (req, res) => {
        try{
        const db = req.app.get('db')
        // get id of connetion between user and channel
        const {channel_id} = req.params
        const user_id = req.session.user.id
        // console.log(`destroying connection: ${channel_id} & ${user_id}`)
        let unfollowChannel = await db.unfollowChannel(channel_id,user_id)
        res.status(200).send('user is no longer following channel')
        }catch (error){
            console.log('error unfollowing Channel',  error)
        }
    }
    

    // Edit Channel Message
    // Delete Channel Message
    // React to Channel Message
}