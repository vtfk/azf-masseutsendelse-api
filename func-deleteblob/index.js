const { deleteBlob } = require("../sharedcode/blob-storage")
const HTTPError = require("../sharedcode/vtfk-errors/httperror")

module.exports = async function (context, req, id, fileName) {
    try {
        //Get ID from the request 
        const id = context.bindingData.id
        //Get filename from the request 
        const fileName = context.bindingData.fileName

        const file = await deleteBlob({fileName: fileName})
        context.res.send(file)
        context.res.status(200).send('File deleted')
    }catch (err) {
        context.log(err)
        context.res.status(400).send(err)
        throw err
    }
}