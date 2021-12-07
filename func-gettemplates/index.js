const mongoose = require("mongoose");
const Templates = require('../sharedcode/models/templates.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')


module.exports = async function (context) {
    try {
        // Await the db connection 
        await getDb()
        context.log("Mongoose is connected")

        // Find all the templates
        let templates = await Templates.find({})
        if(!templates) { throw new Error('No templates found in the databases') }

        //Return the Templates
        context.res.send(templates)

        // Close the database connection 
        mongoose.connection.close()
    } catch (err) {
        context.log(err)
        context.res.status(400).send(err)
        throw err
    }
}


