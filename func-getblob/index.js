const HTTPError = require('../sharedcode/vtfk-errors/httperror')
const blobClient = require('@vtfk/azure-blob-client');

module.exports = async function (context, req) {
    try {
        // Authentication / Authorization
        if(req.headers.authorization) await require('../sharedcode/auth/azuread').validate(req.headers.authorization);
        else if(req.headers['x-api-key']) require('../sharedcode/auth/apikey')(req.headers['x-api-key']);
        else throw new HTTPError(401, 'No authentication token provided');

        // Input validation
        if(!context.bindingData.id) throw new HTTPError(400, 'dispatchId must be specified');
        if(!context.bindingData.name) throw new HTTPError(400, 'name must be specified');
        // Retreive the file
        const file = await blobClient.get(`${context.bindingData.id}/${context.bindingData.name}`)
        if(!file) {throw new HTTPError(404, 'No files found, check if you passed the right filename and/or the right dispatchId')}
        
        // Return the file
        context.res.send(file)
    }catch (err) {
        context.log(err)
        context.res.status(400).send(err)
        throw err
    }
}