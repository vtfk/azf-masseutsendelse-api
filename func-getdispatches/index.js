const Dispatches = require('../sharedcode/models/dispatches.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')
const HTTPError = require('../sharedcode/vtfk-errors/httperror');

module.exports = async function (context, req) {
    try {
        console.log(req.headers);
        // Authentication / Authorization
        if(req.headers.authorization) await require('../sharedcode/auth/azuread').validate(req.headers.authorization);
        else if(req.headers['x-api-key']) require('../sharedcode/auth/apikey')(req.headers['x-api-key']);
        else throw new HTTPError(401, 'No authentication token provided');

        // Await the DB connection 
        await getDb()
        context.log("Mongoose is connected")

        // Find all disptaches 
        let dispatch = await Dispatches.find({})
        if(!dispatch) { throw new HTTPError(404, 'No dispatches found in the database.') }


        // Return the disptaches
        context.res.send(dispatch)
    } catch (err) {
        context.log(err)
        context.res.status(400).send(err)
        throw err
    }
}


