const mongoose = require('mongoose')

module.exports = {
    setupDB () {
      // Connect to Mongoose
      beforeAll(async () => {
        const uri = "mongodb+srv://masseutsendelse:32EgOSiUmXMXjgML87JMDDbFrgyGfFk6O@cluster0.jlu5j.azure.mongodb.net/masseutsendelse?retryWrites=true&w=majority"
        await mongoose.connect(uri, { useNewUrlParser: true })
    })
  
    //   // Cleans up database between each test
    //   afterEach(async () => {
    //     await removeAllCollections()
    //   })
  
      // Disconnect Mongoose
      afterAll(async () => {
        await mongoose.connection.close()
      })
    }
  }