const HTTPError = require('../sharedcode/vtfk-errors/httperror')
const blobClient = require('@vtfk/azure-blob-client');
const { azfHandleResponse, azfHandleError } = require('@vtfk/responsehandlers');

module.exports = async function (context, req) {
  try {
    // Authentication / Authorization
    await require('../sharedcode/auth/auth').auth(req);
    
    // Input validation
    if (!context.bindingData.id) throw new HTTPError(400, 'dispatchId must be specified');
    if (!context.bindingData.name) throw new HTTPError(400, 'name must be specified');

    // Retreive the file
    let file = ''
    if(process.env.NODE_ENV !== 'test') {
      file = await blobClient.get(`${context.bindingData.id}/${context.bindingData.name}`)
      if (!file || !file.data) throw new HTTPError(404, 'No files found, check if you passed the right filename and/or the right dispatchId')
    } else {
      file = context.bindingData.file
      if(!context.bindingData.file) throw new HTTPError(400, 'No Files found')
    }
   
    // Return the file
    return await azfHandleResponse(file, context, req)
  } catch (err) {
    return await azfHandleError(err, context, req)
  }
}