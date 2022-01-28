
const Dispatches = require('../sharedcode/models/dispatches.js')
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

        //Find Dispatch by ID
        let disptach = await Dispatches.findById(id)
        if(!disptach) { 
            logger('error', [`Disptach with id ${id} could no be found`])
            throw new HTTPError(404, `Disptach with id ${id} could no be found`) 
        }
        
        //Return the dispatch object 
        let disptachById = await Dispatches.findById(id, req.body, {new: true})
        context.res.send(disptachById)

    } catch (err) {
        context.log(err);
        logger('error', [err])
        context.res.status(400).send(JSON.stringify(err, Object.getOwnPropertyNames(err)))
        throw err;
    }
}
