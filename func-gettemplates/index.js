const Templates = require('../sharedcode/models/templates.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')
const HTTPError = require('../sharedcode/vtfk-errors/httperror');


module.exports = async function (context, req) {
    try {
        // Authentication / Authorization
        if(req.headers.authorization) await require('../sharedcode/auth/azuread').validate(req.headers.authorization);
        else if(req.headers['x-api-key']) require('../sharedcode/auth/apikey')(req.headers['x-api-key']);
        else throw new HTTPError(401, 'No authentication token provided');

        // Await the db connection.
        await getDb()
        context.log("Mongoose is connected")

        // Find all the templates
        let templates = await Templates.find({})
        if(!templates) { throw new HTTPError(404, 'No templates found in the databases') }

        //Return the Templates
        context.res.send(templates)

    } catch (err) {
        context.log(err)
        context.res.status(400).send(JSON.stringify(err, Object.getOwnPropertyNames(err)))
        throw err
    }
}


