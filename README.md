# azf-masseutsendelse-api
API used to by masseutsendelse-web to communicate with various systems and APIs.

# Usage

1. Clone/Fork the project.
2. npm i
3. Setup the enviroment variables.
4. npm test
5. func start
6. Import to Azure. 

## Environment variables

| Variabel | Description | Example |
|---|---|---|
| MONGODB_CONNECTIONSTRING | The connecting string for a MongoDB database | mongodb+srv://**[account]**:**[password]**@[clustername]/masseutsendelse?retryWrites=true&w=majority
| AZURE_BLOB_CONNECTIONSTRING | The connectionstring for Azure Storage account blob | DefaultEndpointsProtocol=https;AccountName=[AccountName];AccountKey=[AccountKey];EndpointSuffix=core.windows.net |
| AZURE_BLOB_CONTAINERNAME | The container name of the blob storage | blobs
| AZUREAD_JWK_URI | JWT signing keys url | https://login.microsoftonline.com/**[TenantId]**/discovery/v2.0/keys" |
| AZUREAD_ISSUER_URI | URL for the JWT issuer | https://sts.windows.net/**[TenantId]**/ |
| AZUREAD_CLIENTID | The Azure applicaiton id | 0e1e9f89-d80a-4e3b-b5be-5d8cd9a9ca5c |
| AZUREAD_ALLOWEDGROUPS | Comma sepparated list of group object ids | bf9f0fb9-47c8-474d-be11-354a41a9f16f, b519ee09-6259-4459-8ead-a3e7afaaf018 |
| APIKEYS | Any API key(s) you want to be valid | APIKey |
| VTFK_MATRIKKELPROXY_BASEURL | The baseurl for the MatrikkelProxyAPI | https://**[url]**:**[port]**/ (Must end with slash) |
| VTFK_MATRIKKELPROXY_APIKEY | The APIKey for connecting to the MatrikkelProxyAPI | APIKey |
| VTFK_PDFGENERATOR_ENDPOINT | The endpoint url for azf-pdfgenerator v2 endpoint
| VTFK_P360_ARCHIVE_ENDPOINT | VTFK azf-archive endpoint | https://[FQDN]/archive/v1/
| VTFK_P360_ARCHIVE_SUBSCRIPTION_KEY | APIM subscription key | [GUID]
| PAPERTRAIL_HOST | URL to the papertrail log | papertrail.example.com/v1/log |
| PAPERTRAIL_TOKEN | Token to the papertrail log | TOKEN |

## Endpoints GET

**`GET /dispatches`**

Will return all the dispach objects from the database, will return empty array if there's no dispatch objects found. 

**`GET /dispatches/{id}`**

Will return the dispach object with the id provided. It will only return one single object.

### Example dispaches & dispaches/{id}

```json
[
    {
        "stats": {
            "affectedCount": 58,
            "area": null,
            "totalOwners": 61,
            "privateOwners": 51,
            "businessOwners": 10
        },
        "polygons": {
            "extremes": {
                "north": [
                    512590.93,
                    6572724.996
                ],
                "west": [
                    511851.99,
                    6572411.712
                ],
                "east": [
                    515118.2359720102,
                    6572049.915187314
                ],
                "south": [
                    514641.8071519889,
                    6571805.49782388
                ]
            },
            "EPSG": "5972",
            "area": 1633928024411775.2,
            "center": [
                513485.1129860051,
                6572265.24691194
            ],
            "polygons": [ //Array with all the polygons in the uploaded file. 
                {
                    "extremes": {
                        "north": [
                            512590.93,
                            6572724.996
                        ],
                        "west": [
                            511851.99,
                            6572411.712
                        ],
                        "east": [
                            514608.599,
                            6572177.313999999
                        ],
                        "south": [
                            514508.099,
                            6572073.137999999
                        ]
                    },
                    "EPSG": "5972",
                    "area": 1037662459883201,
                    "center": [
                        513230.29449999996,
                        6572399.067
                    ],
                    "vertices": [ //Polygon points
                        [
                            512039.7249999999,
                            6572426.734
                        ],
                        [
                            512038.389,
                            6572459.488
                        ],
                        [
                            512072.92,
                            6572477.272000001
                        ],
                        [
                            512039.7249999999,
                            6572426.734
                        ]
                    ],
                    "_id": "620f63a03ce6a6a47546527d"
                }
            ]
        },
        "_id": "620f639ad96d2f1ef80e6fd6",
        "title": "Møte demo",
        "projectnumber": "Møte demo",
        "archivenumber": "22/00009", //Valid archive number from P360
        "validatedArchivenumber": "22/00009",
        "archiveUrl": "https://360test.vtfk.no",
        "status": "approved",
        "template": {
            "version": 10,
            "name": "Varsel ved oppstart av prosjekt",
            "description": "Mal for varsling til naboer ved oppstart av nytt prosjekt",
            "language": "nb",
            "documentDefinitionId": "brevmal",
            "data": { //Content of the template
                "tittel": "Demo",
                "beskrivelse av prosjekte": "Demo",
                "fremdrift": "Demo",
                "Regelverk": "Demo"
            },
            "template": "Base64",
            "_id": "61d84dad786bdf965164c6fc"
        },
        "attachments": [
            {
                "name": "Excel regneark.xlsx",
                "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "size": 8716,
                "lastModified": 1643815296076,
                "lastModifiedDate": "2022-02-02T15:21:36.076Z"
            }
        ],
        "createdTimestamp": "2022-02-18T09:08:28.705Z",
        "createdBy": "Demo Demosen",
        "createdByEmail": "demo.demosen@vtfk.no",
        "createdById": "ea35b300-ee14-5fch-b4a0-a03e7dc91337",
        "createdByDepartment": "Teknologi og digitalisering",
        "modifiedTimestamp": "2022-02-18T09:17:30.910Z",
        "modifiedBy": "Demo Demosen",
        "modifiedByEmail": "demo.demosen@vtfk.no",
        "modifiedByDepartment": "Teknologi og digitalisering",
        "modifiedById": "ea35b300-ee14-5fch-b4a0-a03e7dc91337",
        "__v": 0,
        "approvedBy": "Demo Demosen",
        "approvedByEmail": "demo.demosen@vtfk.no",
        "approvedById": "ea35b300-ee14-5fch-b4a0-a03e7dc91337",
        "approvedTimestamp": "2022-02-18T09:17:31.004Z"
    }
]
```

**`GET /readyDisptaches`**

Will return all the dispaches with status='approved' and if the dispach has passed the registration threshold.
It will also create the E18 Job, which will include any attachments and templates used and the receivers of the documents. The E18 job will consist of an array of tasks needed to be performed by E18.

For documentation on E18:
 - https://github.com/vtfk/E18-api
 
### Example readyDispaches
```json
[
    {
        "_id": "620f639ad96d2f1ef80e6fd6",
        "e18Job": {
            "system": "masseutsendelse", //System for E18 to recognize
            "projectId": 30,
            "type": "masseutsendelse",
            "parallel": true,
            "delayUntil": "2022-02-19T11:00:00.000Z",
            "tasks": [
                {
                    "system": "p360",
                    "method": "SyncPrivatePerson",
                    "dependencyTag": "sync",
                    "data": {
                        "ssn": "01010101010"
                    }
                },
                {
                    "system": "p360",
                    "method": "SyncEnterprise",
                    "dependencyTag": "sync",
                    "data": {
                        "orgnr": "101010101"
                    }
                },
                {
                    "system": "p360",
                    "method": "archive",
                    "dependencyTag": "createCaseDocument",
                    "dependencies": [
                        "sync"
                    ],
                    "data": {
                        "system": "masseutsendelse",
                        "template": "utsendelsesdokument",
                        "parameter": {
                            "title": "Demo",
                            "caseNumber": "22/00009",
                            "date": "2022-02-18T11:51:46.223Z",
                            "contacts": [
                                {
                                    "ssn": "01010101010",
                                    "role": "Mottaker"
                                },
                                {
                                    "ssn": "101010101",
                                    "role": "Mottaker"
                                }
                            ],
                            "attachments": [
                                {
                                    "title": "Demo",
                                    "format": "pdf",
                                    "versionFormat": "A",
                                    "base64": "base64"
                                }
                            ],
                            "accessCode": "U",
                            "accessGroup": "Alle",
                            "paragraph": "",
                            "responsiblePersonEmail": "demo.demosen@vtfk.no"
                        }
                    }
                },
                {
                    "system": "p360",
                    "method": "archive",
                    "dependencyTag": "uploadAttachment-1",
                    "dependencies": [
                        "createCaseDocument"
                    ],
                    "dataMapping": "parameter.documentNumber=DocumentNumber",
                    "data": {
                        "system": "archive",
                        "template": "add-attachment",
                        "parameter": {
                            "secure": false,
                            "title": "test",
                            "format": ".txt",
                            "base64": "base64",
                            "versionFormat": "P"
                        }
                    }
                },
                {
                    "system": "p360",
                    "method": "archive",
                    "dependencies": [
                        "uploadAttachment-1"
                    ],
                    "dataMapping": "{\"parameter\": { \"Documents\": [ { \"DocumentNumber\": \"{{DocumentNumber}}\" }]}}",
                    "data": {
                        "method": "DispatchDocuments",
                        "service": "DocumentService"
                    }
                }
            ]
        }
    }
]
```

**`GET /blobs/{id}/{name}`**

**`GET /matrikkel/{endpoint}`**

**`GET /templates`**

Will return all the templates found in the database.

**`GET /templates/{id}`**

Will return the template with the id provided. It will only return one single object.

### Example templates & templates/{id}

```json
[
    {
        "_id": "61d84dad786bdf965164c6fc",
        "name": "Varsel ved oppstart av prosjekt",
        "description": "Mal for varsling til naboer ved oppstart av nytt prosjekt",
        "version": 1,
        "enabled": true, 
        "documentDefinitionId": "brevmal",
        "template": "base64",
        "language": "nb",
        "createdTimestamp": "2022-01-07T14:25:08.981Z",
        "createdBy": "Demo",
        "createdById": "00000000-0000-0000-0000-000000000000",
        "modifiedTimestamp": "2022-01-27T08:46:01.524Z",
        "modifiedBy": "Demo Demosen",
        "modifiedById": "00000000-0000-0000-0000-000000000000",
        "__v": 0,
        "modifiedByDepartment": "Teknologi og digitalisering"
    }
]
```

## Endpoints POST

**`POST /dispatches`**

**`POST /templates`**

## Endpoints PUT

**`PUT /dispatches/{id}`**

This endpoint is used to edit a given dispach.

If status='approved' you're not allowed to edit anythig except the status of the dispach object. 
If status='completed' you're not allowed to edit the dispach object at all. 

Fields that cannot be edited.
- 'validatedArchivenumber' 
- 'createdTimestamp' 
- 'createdBy'
- 'createdById'
- 'createdByDepartment'
- 'modifiedTimestamp'
- 'modifiedBy'
- 'modifiedById'
- 'modifiedByDepartment'

**`PUT /dispatches/{id}/complete`**

This endpoint is used to complete a dispatch when the job is posted to E18. The endpoint will set status='completed' and remove all the owners from the object. 
This endpoint is used by test-la-masseutsendelse and prod-la-masseutsendelse.

**`PUT /templates/{id}`**
This endpoint is used to edit a given template. 

Fields that cannot be edited. 
- 'createdTimestamp'
- 'createdBy'
- 'createdById'
- 'modifiedTimestamp'
- 'modifiedBy'
- 'modifiedById'


















