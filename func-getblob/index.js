const HTTPError = require('../sharedcode/vtfk-errors/httperror')
const blobClient = require('@vtfk/azure-blob-client');
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

        // Input validation
        if(!context.bindingData.id) {
            logger('error', ['dispatchId must be specified'])
            throw new HTTPError(400, 'dispatchId must be specified');
        }
        if(!context.bindingData.name) {
            logger('error', ['name must be specified'])
            throw new HTTPError(400, 'name must be specified');
        }
        // Retreive the file
        const file = await blobClient.get(`${context.bindingData.id}/${context.bindingData.name}`)
        if(!file) {
            logger('error', ['No files found, check if you passed the right filename and/or the right dispatchId'])
            throw new HTTPError(404, 'No files found, check if you passed the right filename and/or the right dispatchId')
        }
        
        // Return the file
        context.res.send(file)
    } catch (err) {
        context.log(err)
        logger('error', [err])
        context.res.status(400).send(JSON.stringify(err, Object.getOwnPropertyNames(err)))
        throw err
    }
}