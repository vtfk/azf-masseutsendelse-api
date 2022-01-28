# azf-masseutsendelse-api
Api for masseutsendelse

# Environment variables
| Variabel | Description | Example |
|---|---|---|
| MONGODB_CONNECTIONSTRING | The connecting string for a MongoDB database | mongodb+srv://**[account]**:**[password]**@[clustername]/masseutsendelse?retryWrites=true&w=majority
| AZURE_BLOB_CONNECTIONSTRING | The connectionstring for Azure Storage account blob | DefaultEndpointsProtocol=https;AccountName=[AccountName];AccountKey=[AccountKey];EndpointSuffix=core.windows.net
| AZURE_BLOB_CONTAINERNAME | The container name of the blob storage | blobs
| AZUREAD_JWK_URI | JWT signing keys url | https://login.microsoftonline.com/**[TenantId]**/discovery/v2.0/keys"
| AZUREAD_ISSUER_URI | URL for the JWT issuer | https://sts.windows.net/**[TenantId]**/
| AZUREAD_CLIENTID | The Azure applicaiton id | 0e1e9f89-d80a-4e3b-b5be-5d8cd9a9ca5c
| AZUREAD_ALLOWEDGROUPS | Comma sepparated list of group object ids | bf9f0fb9-47c8-474d-be11-354a41a9f16f, b519ee09-6259-4459-8ead-a3e7afaaf018 |
| VTFK_MATRIKKELPROXY_BASEURL | The baseurl for the MatrikkelProxyAPI | https://**[url]**:**[port]**/ (Must end with slash) |
| VTFK_MATRIKKELPROXY_APIKEY | The APIKey for connecting to the MatrikkelProxyAPI | APIKey |
| VTFK_PDFGENERATOR_ENDPOINT | The endpoint url for azf-pdfgenerator v2 endpoint
| VTFK_P360_ARCHIVE_ENDPOINT | VTFK azf-archive endpoint | https://[FQDN]/archive/v1/
| VTFK_P360_ARCHIVE_SUBSCRIPTION_KEY | APIM subscription key | [GUID]
