const { downloadBlob } = require('../sharedcode/blob-storage')
const HTTPError = require('../sharedcode/vtfk-errors/httperror')

module.exports = async function (context, req, id, fileName) {
    try {
        // Get ID from the request
        const id = context.bindingData.id
        // Get fileName from the request
        const name = context.bindingData.name

        const file = await downloadBlob({dispatchId: id, name: name})
        if(!file) {throw new HTTPError(404, 'No files found, check if you passed the right filename and/or the right dispatchId')}
        context.res.send(file)
    }catch (err) {
        context.log(err)
        context.res.status(400).send(err)
        throw err
    }
}