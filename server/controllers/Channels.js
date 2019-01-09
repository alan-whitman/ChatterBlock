module.exports = {
    createChannel: async (req,res) => {
        try {
        const db = req.app.get('db')
            //this is post id    
        const {channel_name, creator_id} = req.body
            // get channel name and creator from rec body
            console.log(req.body)
            // see if channel_name is already in use
            let channelResponse = await db.getChannelByName(channel_name)
console.log(channelResponse)
            if (channelResponse[0]) {
                return res.status(409).send('this channel name is in use')
            }
            // if not in use

            let response = await db.createChannel( {channel_name, creator_id} )
            // database will return the newly created channel
            console.log(response)
            let newChannel = response[0]
            //send user info back to client
            res.send(newChannel)
            console.log(newChannel)


        }catch (error){

        }
    },
    getChannel: async (req,res) => {
        try {
        // console.log('attemping to get single post')
        const db = req.app.get('db')
    //this is post id    
        const {channel_name} = req.body
    // need to verify user has rights to view
        let channel = await db.getChannelByName(channel_name)
        res.send(channel)

        } catch (error) {
        console.log('error getting post:', error)
        res.status(500).send(error)           
        }
    },
    getAllChannels: async (req,res) => {
        try {
        const db = req.app.get('db')
        
        let channels =await db.getAllChannels()
        res.send(channels)
console.log(channels)
        }catch (error){
        console.log('error getting all channels:', error)
        }
    },
    getChannelWithMessages: async (req,res) => {
        try {

        const db = req.app.get('db')
        const {channel_id} = req.body
        let channelFull = await db.getChannelWithMessages(channel_id)
        res.send(channelFull)
        } catch (error){
console.log('error getting channel', error)
        }
    },
    createMessage: async (req, res) => {
        try {
        console.log("attemping to add channel message", req.body)
        const db = req.app.get('db')
        let time_stamp = Date.now()
        const {channel_id, user_id, content_text, content_image} = req.body
        console.log("attemping to add channel message",channel_id, user_id, content_text, content_image, time_stamp)

        let newMessage = await db.createChannelMessage({channel_id, user_id, content_text, content_image, time_stamp})
        res.send(newMessage)
        } catch (error){
            console.log('error creating new message',  error)
        }
    }
}