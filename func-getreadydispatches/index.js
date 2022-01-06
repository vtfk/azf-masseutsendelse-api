const Dispatches = require('../sharedcode/models/dispatches.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')
const HTTPError = require('../sharedcode/vtfk-errors/httperror');

let arr = []

function pick(obj, ...props) {
    return props.reduce(function(result, prop) {
      result[prop] = obj[prop];
      return result;
    }, {});
}

module.exports = async function (context, req) {
    try {
        // Authentication / Authorization
        if(req.headers.authorization) await require('../sharedcode/auth/azuread').validate(req.headers.authorization);
        else if(req.headers['x-api-key']) require('../sharedcode/auth/apikey')(req.headers['x-api-key']);
        else throw new HTTPError(401, 'No authentication token provided');

        // Await the DB connection 
        await getDb()
        context.log("Mongoose is connected")

        // Find all disptaches 
        let dispatch = await Dispatches.find({'status': 'approved'})
        if(!dispatch) { throw new HTTPError(404, 'No dispatches with the status approved/godkjent found in the database.') }
        
        testObj = {
            projectId: 1,
            system: 'Masseutsendelse',
            tasks: [{ system: 'p360', method: 'updateperson' }, { system:'svarut', method: 'send' }]
            
        }

        for(let i = 0; i < dispatch.length; i++) {
            Object.assign(dispatch[i], testObj)
        }
        
        for(let i = 0; i < dispatch.length; i++) {
            arr.push(pick(dispatch[i], '_id', 'system', 'projectId', 'tasks', 'archivenumber', 'attachments', 'owners' ))
        }

        context.res.send(arr)
        
        arr = []
    } catch (err) {
        context.log(err)
        context.res.status(400).send(err)
        throw err
    }
}


