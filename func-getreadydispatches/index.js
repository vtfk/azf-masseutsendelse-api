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

module.exports = async function (context) {
    try {
        // Await the DB connection 
        await getDb()
        context.log("Mongoose is connected")

        // Find all disptaches 
        let dispatch = await Dispatches.find({'status': 'approved'})
        if(!dispatch) { throw new HTTPError(404, 'No dispatches with the status approved/godkjent found in the database.') }
        
        testObj = {
            system: 'Masseutsendelse',
            tasks: [{system: 'p360'}, {system:'svarut'}] 
        }

        for(let i = 0; i < dispatch.length; i++) {
            Object.assign(dispatch[i], testObj)
        }
        
        for(let i = 0; i < dispatch.length; i++) {
            arr.push(pick(dispatch[i], '_id', 'system', 'tasks', 'archivenumber', 'attachments', 'owners' ))
        }

        context.res.send(arr)
        
        arr = []
    } catch (err) {
        context.log(err)
        context.res.status(400).send(err)
        throw err
    }
}


