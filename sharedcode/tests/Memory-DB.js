
const mongoose = require('mongoose')
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer

let mongod; 
/**
 * Connect to the in-memory database.
 */
module.exports.connect = async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const mongooseOpts = {
        useNewUrlParser: true,
    };
<<<<<<< HEAD
    process.env.URI = uri
=======

>>>>>>> 9d0bbd179416c03b9ac677ab9694ccc4ad0977da
    await mongoose.connect(uri, mongooseOpts);
}
/**
 * Drop database, close the connection and stop mongod.
 */
module.exports.closeDatabase = async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongod.stop();
}
/**
 * Remove all the data for all db collections.
 */
module.exports.clearDatabase = async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany();
    }
}