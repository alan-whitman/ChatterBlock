module.exports = {
requestFriend: async (req,res) => {
    try{
    const db = req.app.get('db')
    const {requester_id, requestee_id} = req.body
    console.log(`attemping to send request from ${requester_id} to ${requestee_id}`)
// Do we want to put check in here to see if request already sent?
    let requestFriend = await db.requestFriend({requester_id, requestee_id})
    res.status(200).send(requestFriend)

    }catch (error){
        console.log('error sending request:', error)
        res.status(500).send(error)   
    }
},
getRequests: async (req, res) => {
    try{
        const db = req.app.get('db')
        const {user_id} = req.body
        let allRequests = await db.getRequests(user_id)
        res.status(200).send(allRequests)
    }catch (error) {
        console.log('error getting user requests:', error)
        res.status(500).send(error)  
    }
},
acceptRequest: async (req,res) => {
    try{
        const db = req.app.get('db')
        // get the id of both users and the request_id
        const { requester_id, requestee_id, id } = req.body
        let acceptFriend = await db.acceptRequest(requester_id, requestee_id)
        db.removeRequest({id})
        res.status(200).send(acceptFriend)
    }catch (error){
        console.log('error accepting friend request:', error)
        res.status(500).send(error)
    }
}
}