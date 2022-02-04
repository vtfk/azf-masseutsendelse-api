const Templates = require('../sharedcode/models/templates.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')
const HTTPError = require('../sharedcode/vtfk-errors/httperror');
const { logConfig, logger } = require('@vtfk/logger')


module.exports = async function (context, req) {
  try {
    // Configure the logger
    logConfig({
      azure: { context }
    })

    // Authentication / Authorization
    await require('../sharedcode/auth/auth').auth(req);

    // Await the database
    await getDb()
    context.log("Mongoose is connected.");

    // Delete the template, if it fails it probably means that it is already deleted
    try { await Templates.findByIdAndDelete(context.bindingData.id); }
    catch { context.res.send(); }
    
    context.res.send();

  } catch (err) {
   err;
    logger('error', [err])
    context.res.status(400).send(err)
    throw err;
  }
}