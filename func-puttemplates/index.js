const mongoose = require("mongoose");
const Templates = require('../sharedcode/models/templates.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js');
const u = require('util');

module.exports = async function (context, req, id) {
    var urlId = context.bindingData.id
    id = `${urlId}`

    context.log(u.inspect(req.body, true, 100, true));

    let loadDatabase = await getDb()
    if (await loadDatabase) {
        context.log("Mongoose is connected.");
        try {
            await Templates.findByIdAndUpdate(id, req.body, {new: true}).then((editedTemplates) => {
                if(!editedTemplates){
                    context.res.status(404).send()
                }
                context.res.send(editedTemplates)
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
