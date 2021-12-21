# azf-test-masseutsendelse-api
Test api for masseutsendelse

# Environment variables
| Variabel | Description | Example |
|---|---|---|
| MONGODB_CONNECTIONSTRING | The connecting string for a MongoDB database | mongodb+srv://[account]:[password]@[clustername]/masseutsendelse?retryWrites=true&w=majority
| AZURE_BLOB_CONNECTIONSTRING | The connectionstring for Azure Storage account blob | DefaultEndpointsProtocol=https;AccountName=[AccountName];AccountKey=[AccountKey];EndpointSuffix=core.windows.net
| AZURE_BLOB_CONTAINERNAME | The container name of the blob storage | blobs
| MATRIKKELPROXY_BASEURL | The baseurl for the MatrikkelProxyAPI | https://[url]:[port]/ (Must end with slash)
| MATRIKKELPROXY_APIKEY | The APIKey for connecting to the MatrikkelProxyAPI | APIKey