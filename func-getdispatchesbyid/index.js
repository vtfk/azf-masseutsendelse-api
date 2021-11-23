const mongoose = require("mongoose");
const Dispatches = require('../sharedcode/models/dispatches.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')

module.exports = async function (context, req, id) {
    var urlId = context.bindingData.id
    id = `${urlId}`
    let loadDatabase = await getDb()
    if (await loadDatabase) {
        context.log("Mongoose is connected.");
        try {
            await Dispatches.findById(id, req.body, {new: true}).then((dispatchObject) => {
                if(!dispatchObject){
                    context.res.status(404).send()
                }
                context.res.send(dispatchObject)
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
