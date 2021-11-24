const mongoose = require("mongoose");
const Dispatches = require('../sharedcode/models/dispatches.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js');
const util = require('util');

module.exports = async function (context, req, id) {
    var urlId = context.bindingData.id
    id = `${urlId}`
    let loadDatabase = await getDb()
    if (await loadDatabase) {
        context.log("Mongoose is connected.");
        try {
            await Dispatches.findByIdAndUpdate(id, req.body, {new: true}).then((editedDispatch) => {
                if(!editedDispatch){
                    context.res.status(404).send()
                }
                context.res.send(editedDispatch)
            }).catch(error => {
                res.status(500).send(error)
            })
        } catch (err) {
            context.log.error('ERROR', err)
            throw err
        } 
    }
    mongoose.connection.close()
}
