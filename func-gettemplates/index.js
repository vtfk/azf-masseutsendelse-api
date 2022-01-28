const Templates = require('../sharedcode/models/templates.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')
const HTTPError = require('../sharedcode/vtfk-errors/httperror');
const { logConfig, logger } = require('@vtfk/logger')

module.exports = async function (context, req) {
    logConfig({
        azure: { context }
    })

    try {
        // Authentication / Authorization
        if(req.headers.authorization) await require('../sharedcode/auth/azuread').validate(req.headers.authorization);
        else if(req.headers['x-api-key']) require('../sharedcode/auth/apikey')(req.headers['x-api-key']);
        else {
            logger('error', ['No authentication token provided'])
            throw new HTTPError(401, 'No authentication token provided');
        }

        // Await the db connection.
        await getDb()
        context.log("Mongoose is connected")

        // Find all the templates
        let templates = await Templates.find({})
        if(!templates) { 
            logger('error', ['No templates found in the databases'])
            throw new HTTPError(404, 'No templates found in the databases') 
        }

        //Return the Templates
        context.res.send(templates)

    } catch (err) {
        context.log(err)
        logger('error', [err])
        context.res.status(400).send(JSON.stringify(err, Object.getOwnPropertyNames(err)))
        throw err
    }
}


