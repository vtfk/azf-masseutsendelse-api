const { BlobServiceClient } = require('@azure/storage-blob')

const { v4: uuid } = require('uuid')
// const connectionString = "DefaultEndpointsProtocol=https;AccountName=blobmasseutsendelse;AccountKey=2UQErDd9lobCpAvmN8tkFaYiRFxfexzETuau7VJM4fiBcwvG6fB/tvJdfaC4gkawUKuidYUPTdUIMYcseXcrBQ==;EndpointSuffix=core.windows.net"
const getBlobContainer = () => {
    const blobServiceClient = BlobServiceClient.fromConnectionString(process.env.STORAGE_ACCOUNT_CONNECTIONSTRING)
    return blobServiceClient.getContainerClient(process.env.STORAGE_ACCOUNT_BLOB_NAME)
}

async function streamToBuffer (readableStream) {
    return new Promise((resolve, reject) => {
        const chunks = []
        readableStream.on('data', (data) => {
            chunks.push(data instanceof Buffer ? data : Buffer.from(data))
        })
        readableStream.on('end', () => {
            resolve(Buffer.concat(chunks))
        })
        readableStream.on('error', reject)
    })
}

// Upload content to blob storage
const uploadBlob = async options => {
    if(!options.dispatchId) throw new Error('The dispatchId must be provided for uploading files')
    const blobName = `${options.dispatchId}/` + (options.fileName || uuid())
    const containerClient = getBlobContainer()

    const blockBlobClient = containerClient.getBlockBlobClient(blobName)
    await blockBlobClient.upload(options.content, options.content.length)
    return blobName
}

// Download blob from blob storage 
async function downloadBlob (options) {
    if(!options.dispatchId) throw new Error('The dispatchId must be provided for downloading files')
    // const blobName = `${options.dispatchId}/` + (options.fileName || uuid())
    const blobName = options.fileName
    const containerClient = getBlobContainer()
    console.log(blobName)

    const blobClient = containerClient.getBlobClient(blobName)
    const downloadResponse = await blobClient.download()

    let content = (await streamToBuffer(downloadResponse.readableStreamBody)).toString()

    return {fileName: blobName.split('/').pop(), content}
}

// Delete blob from blob storage
async function deleteBlob (options) {
    if(!options.fileName) throw new Error('The filename must be provided for the file you want to delete.')
    const blobName = options.fileName

    const containerClient = getBlobContainer()

    const blobClient = containerClient.getBlockBlobClient(blobName)
    await blobClient.delete()
}

module.exports = {
    uploadBlob,
    downloadBlob,
    deleteBlob
}