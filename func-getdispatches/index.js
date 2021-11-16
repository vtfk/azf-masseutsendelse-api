const mongoose = require("mongoose");
const Dispatches = require('../sharedcode/models/dispatches.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')

module.exports = async function (context) {
    let loadDatabase = await getDb()
    if (await loadDatabase) {
        context.log("Mongoose is connected.");
        let data
        try {
            await Dispatches.find({}).then((dispatches) => {
                data = dispatches
            })
        } catch (err) {
            context.log.error('ERROR', err)
            throw err
        }
        context.res = {
            status: 200,
            body: data
        }
        mongoose.connection.close()
    }
}


