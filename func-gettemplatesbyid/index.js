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

        // Get ID from request
        const id = context.bindingData.id

        // Await the database
        await getDb()
        context.log("Mongoose is connected.");

        //Find Template by ID
        let template = await Templates.findById(id)
        if(!template) {
            logger('error', [`Template with id ${id} could no be found`]) 
            throw new HTTPError(`Template with id ${id} could no be found`) 
        }

        //Return the template object 
        let templateById = await Templates.findById(id, req.body, {new: true})
        context.res.send(templateById)

    }catch (err) {
        context.log(err);
        logger('error', [err])
        context.res.status(400).send(JSON.stringify(err, Object.getOwnPropertyNames(err)))
        throw err;
    }
}
