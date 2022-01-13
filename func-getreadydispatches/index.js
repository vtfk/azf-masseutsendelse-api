const Dispatches = require('../sharedcode/models/dispatches.js')
const getDb = require('../sharedcode/connections/masseutsendelseDB.js')
const HTTPError = require('../sharedcode/vtfk-errors/httperror');

let arr = []
let ownersArray = []

let postAdresse = {
    adresse: "",
    postNummer: "",
    postSted: "",
}
let ownerSimplified = {
    navn: "",
    nummer: "",
    postAdresse: "",
}

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
    

        for(let i = 0; i < dispatch.length; i++) {
            testObj = {
                projectId: 30,
                system: 'Masseutsendelse',
                tasks: [{ system: 'p360', method: 'updateperson' }, { system:'svarut', method: 'send' }]
                
            }
            Object.assign(dispatch[i], testObj)
        }
        
        for(let i = 0; i < dispatch.length; i++) {
            arr.push(pick(dispatch[i], 'owners'))
        }

        let owners = arr.map(x => x.owners)

        for(let i = 0; i < owners.length; i++) {
            for(let j = 0; j < owners[i].length; j++) {
                if (owners[i][j]._type === "FysiskPerson") {
                    if (owners[i][j].dsf === undefined || owners[i][j].dsf.NAVN === undefined) {
                        console.log(` ${owners[i][j].navn } was skipped. No brreg information on the company/person`)
                    } else {
                        postAdresse = {}
                        ownerSimplified = {}
                        Object.assign(ownerSimplified, { navn: owners[i][j].dsf.NAVN } )
                        Object.assign(ownerSimplified, { nummer: owners[i][j].dsf.INR } )

                        Object.assign(postAdresse, { adresse: owners[i][j].dsf.ADR } )
                        Object.assign(postAdresse, { postNummer: owners[i][j].dsf.POSTN } )
                        Object.assign(postAdresse, { postSted: owners[i][j].dsf.POSTS } )

                        Object.assign(ownerSimplified, { postAdresse: postAdresse } )
                    }
                }
                else if (owners[i][j]._type === "JuridiskPerson") {
                    postAdresse = {}
                    ownerSimplified = {}
                    
                    if (owners[i][j].brreg === undefined || owners[i][j].brreg.forretningsadresse === undefined ) {
                        Object.assign(ownerSimplified, { navn: owners[i][j].navn } )
                        Object.assign(ownerSimplified, { nummer: owners[i][j].nummer } )

                        Object.assign(postAdresse, { adresse: "" } )
                        Object.assign(postAdresse, { postNummer: "" } )
                        Object.assign(postAdresse, { postSted: "" } )
                        console.log(` ${owners[i][j].navn } was skipped. No brreg information on the company/person`)
                    } else {
                        Object.assign(ownerSimplified, { navn: owners[i][j].navn } )
                        Object.assign(ownerSimplified, { nummer: owners[i][j].nummer } )

                        Object.assign(postAdresse, { adresse: owners[i][j].brreg.forretningsadresse.adresse } )
                        Object.assign(postAdresse, { postNummer: owners[i][j].brreg.forretningsadresse.postnummer } )
                        Object.assign(postAdresse, { postSted: owners[i][j].brreg.forretningsadresse.poststed } )

                        Object.assign(ownerSimplified, { postAdresse: postAdresse } )   
                    }
                }
                ownersArray.push(ownerSimplified)
                Object.assign(dispatch[i], {owners: ownersArray})
            }
            ownersArray = []
        }
        
        arr = []

        for(let i = 0; i < dispatch.length; i++) {
            arr.push(pick(dispatch[i], '_id', 'system', 'projectId', 'tasks', 'archivenumber', 'attachments', 'template', 'owners'))
        }
      
        context.res.send(arr)
        ownersArray = []
        arr = []
    } catch (err) {
        context.log(err)
        context.res.status(400).send(JSON.stringify(err, Object.getOwnPropertyNames(err)))
        throw err
    }
}


