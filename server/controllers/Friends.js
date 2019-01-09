module.exports = {
requestFriend: async (req,res) => {
    try{
    const db = req.app.get('db')
    const {requester_id, requestee_id} = req.body
// Do we want to put check in here to see if request already sent?
    let requestFriend = await db.requestFriend({requester_id, requestee_id})
    res.status(200).send(requestFriend)

    }catch (error){
        console.log('error sending request:', error)
        res.status(500).send(error)   
    }
}
}