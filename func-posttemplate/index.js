const mongoose = require("mongoose");
const Templates = require('../sharedcode/models/templates.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')

module.exports = async function (context, req) {
    let loadDatabase = await getDb()
    if (await loadDatabase) {
        context.log("Mongoose is connected.");
        const template = new Templates(req.body)
        try {
           await template.save().then((template) => {
                context.res.status(201).send(template)
            }) 
        } catch (err) {
            context.log.error('ERROR', err)
            throw err
        };
        mongoose.connection.close()
    }
}