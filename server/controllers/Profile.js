module.exports={
    getUserProfile: async (req, res) => {
        try{
            const db = req.app.get('db')
            const {id} = req.params
            //USER DATA
                // Get the user data id username about_text user_image verified
            let userData = await db.getUserById(id)
            
            //SUBBED CHANNELS
                // Using user_id get the subbed channels from channel users and join on channels table to return the channel_name and channel_id
                // may want to scrubb some of the data thats being returned ie: last view doesn't matter fo non current user
            let userSubChannels = await db.getAllSubscibedChannels(id)
            //FRIENDS
                // Using user_id get friends by joining friend_id and users table to return and array of friends id username pofile image and about text
            let userFriends = await db.getUserFriends(id)
            // POST META DATA
                // Return the total count of channel_messages with user_id
            let postMeta = await db.getPostMeta(id)
            // RECENT MESSAGES
                // Return x number of recent messages using the user_id in the channel_messages table to return the recent message_text and channel_name by joining with channels table
                // Currently limited to 2 messages and ordered by time_stamp.  May need to change db query.  Not 100% on whether these are most recent or oldest.  should be a quick change
            let profileRecentMessages = await db.getProfileRecentMessages(id)
            


                // console.log(userData, userSubChannels, userFriends,postMeta, profileRecentMessages)
            // create new object for frontend
            function buildJSON(userData, userSubChannels, userFriends,postMeta, profileRecentMessages){
                let obj = {}
                obj.user = userData[0];
                obj.userSubChannels = userSubChannels;
                obj.userFriends = userFriends;
                obj.postMeta = postMeta[0];
                obj.profileRecentMessages = profileRecentMessages;
                console.log(obj)
                res.status(200).send(obj)
            }

            buildJSON(userData, userSubChannels, userFriends,postMeta, profileRecentMessages)



                // probably going to need to assemble the object before returning
            }catch (error){
            console.log('error getting user profile:', error)
            res.status(500).send(error)   
        }
    }
}