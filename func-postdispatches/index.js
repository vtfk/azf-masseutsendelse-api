const mongoose = require("mongoose");
const Dispatches = require('../sharedcode/models/dispatches.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')


module.exports = async function (context, req) {
    let loadDatabase = await getDb()
    if (await loadDatabase) {
        context.log("Mongoose is connected.");
        const dispatch = new Dispatches(req.body)
        try {
           await dispatch.save().then((dispatch) => {
                context.res.status(201).send(dispatch)
            }) 
        } catch (err) {
            context.log.error('ERROR', err)
            throw err
        };
        mongoose.connection.close()
    }
}