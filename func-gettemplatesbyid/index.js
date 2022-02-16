const Templates = require('../sharedcode/models/templates.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')
const HTTPError = require('../sharedcode/vtfk-errors/httperror');
const { logConfig, logger } = require('@vtfk/logger')

module.exports = async function (context, req) {
  try {
    // Configure logger
    logConfig({
      azure: { context }
    })

    // Authentication / Authorization
    await require('../sharedcode/auth/auth').auth(req);

<<<<<<< HEAD
    // Get ID from request  
    const id = context.bindingData.id

    if(!id) throw new HTTPError('400', 'No template id was provided');
=======
    // Get ID from request
    const id = context.bindingData.id
    if(!id) throw new HTTPError('400', 'No dispatch id was provided');
>>>>>>> 9d0bbd179416c03b9ac677ab9694ccc4ad0977da

    // Await the database
    await getDb()

    //Find Template by ID
    let template = await Templates.findById(id)
<<<<<<< HEAD
    if (!template) throw new HTTPError('400', `Template with id ${id} could no be found`)

    //Return the template object 
    let templateById = await Templates.findById(id, req.body, { new: true })
    // context.res.send(templateById)
    return {body: templateById, headers: {'Content-Type': 'application/json'}, status: 200}

  } catch (err) {
    logger('error', [err])
    // context.res.status(400).send(err)
    return {body: err, headers: {'Content-Type': 'application/json'}, status: 400}
=======
    if (!template) throw new HTTPError(`Template with id ${id} could no be found`)

    //Return the template object 
    let templateById = await Templates.findById(id, req.body, { new: true })
    context.res.send(templateById)

  } catch (err) {
    logger('error', [err])
    context.res.status(400).send(err)
    throw err;
>>>>>>> 9d0bbd179416c03b9ac677ab9694ccc4ad0977da
  }
}
