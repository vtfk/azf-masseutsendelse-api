const { BlobServiceClient } = require('@azure/storage-blob')

const { v4: uuid } = require('uuid')
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
    const blobName = `${options.dispatchId}/` + (options.name || uuid())
    const containerClient = getBlobContainer()

    const blockBlobClient = containerClient.getBlockBlobClient(blobName)
    await blockBlobClient.upload(options.content, options.content.length)
    return blobName
}

// Download blob from blob storage 
async function downloadBlob (options) {
    if(!options.dispatchId) throw new Error('The dispatchId must be provided for downloading files')
    const blobName = `${options.dispatchId}/` + options.name;
    const containerClient = getBlobContainer()

    const blobClient = containerClient.getBlobClient(blobName)
    const downloadResponse = await blobClient.download()

    let content = (await streamToBuffer(downloadResponse.readableStreamBody)).toString()

    let extension = '';
    if(options.name.includes('.') && options.name.lastIndexOf('.') !== options.name.length) extension = options.name.substring(options.name.lastIndexOf('.') + 1);

    return { name: blobName.split('/').pop(), extension, content}
}

// Delete blob from blob storage
async function deleteBlob (options) {
    if(!options.name) throw new Error('The name must be provided for the file you want to delete.')
    const blobName = options.name

    const containerClient = getBlobContainer()

    const blobClient = containerClient.getBlockBlobClient(blobName)
    await blobClient.delete()
}

module.exports = {
    uploadBlob,
    downloadBlob,
    deleteBlob
}