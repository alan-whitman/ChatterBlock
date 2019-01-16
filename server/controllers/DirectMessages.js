module.exports = {
    async getActiveDms(req, res) {
        try {
            if (!req.session.user)
                return res.send([]);
            const db = req.app.get('db');
            const { id } = req.session.user;
            const myDms = await db.dm.getActiveDms(id);
            res.send(myDms);
        } catch(err) {
            console.log(err);
        }
    }
}