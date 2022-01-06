const Dispatches = require('../sharedcode/models/dispatches.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')
const HTTPError = require('../sharedcode/vtfk-errors/httperror');
const { validate } = require('../sharedcode/auth/azuread');


module.exports = async function (context, req) {
    try {
        // Auth
        await validate(req.headers.authorization)

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


