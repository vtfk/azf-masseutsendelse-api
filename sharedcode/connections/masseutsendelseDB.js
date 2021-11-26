const mongoose = require("mongoose");
const uri =  process.env.MONGODB_ATLAS

let database = null
module.exports = async function() {
    if(mongoose.connection.readyState === 1) return;
    const client = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000  
        }).catch(err => context.log(err.reason))
    database = client
    return database
}