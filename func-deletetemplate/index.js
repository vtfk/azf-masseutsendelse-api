const mongoose = require("mongoose");
const Templates = require('../sharedcode/models/templates.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')

module.exports = async function (context) {
    var urlId = context.bindingData.id
    id = `${urlId}`
    let loadDatabase = await getDb()
    if (await loadDatabase) {
        context.log("Mongoose is connected.");
        try {
            await Templates.findByIdAndDelete(id).then((deletedTemplates) => {
                if(!deletedTemplates) {
                    context.res.status(404).send()
                }
                context.res.send(deletedTemplates)    
            }).catch(error => {
                res.status(500).send(error)
            })
        }catch (err) {
            context.log.error('ERROR', err)
            throw err
        } 
    }
    mongoose.connection.close()
}