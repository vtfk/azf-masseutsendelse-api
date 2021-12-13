const mongoose = require("mongoose");
const Dispatches = require('../sharedcode/models/dispatches.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')
const HTTPError = require('../sharedcode/vtfk-errors/httperror');


module.exports = async function (context) {
    try {
        // Await the DB connection 
        await getDb()
        context.log("Mongoose is connected")

        // Find all disptaches 
        let dispatch = await Dispatches.find({})
        if(!dispatch) { throw new HTTPError(404, 'No dispatches found in the database.') }

        // Return the disptaches
        context.res.send(dispatch)

        // Close the database connection 
        // // mongoose.connection.close()
    } catch (err) {
        context.log(err)
        context.res.status(400).send(err)
        throw err
    }
}


