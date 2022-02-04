const HTTPError = require('../sharedcode/vtfk-errors/httperror')
const blobClient = require('@vtfk/azure-blob-client');
const { logConfig, logger } = require('@vtfk/logger')

module.exports = async function (context, req) {
  try {
    // Configure the logger
    logConfig({
      azure: { context }
    })

    // Authentication / Authorization
    await require('../sharedcode/auth/auth').auth(req);

    // Input validation
    if (!context.bindingData.id) throw new HTTPError(400, 'dispatchId must be specified');
    if (!context.bindingData.name) throw new HTTPError(400, 'name must be specified');

    // Retreive the file
    const file = await blobClient.get(`${context.bindingData.id}/${context.bindingData.name}`)
    if (!file) throw new HTTPError(404, 'No files found, check if you passed the right filename and/or the right dispatchId')

    // Return the file
    context.res.send(file)
  } catch (err) {
   err
    logger('error', [err])
    context.res.status(400).send(err)
    throw err
  }
}