const mongoose = require('mongoose')

const dispatchesSchema = new mongoose.Schema ({
      "title": {
        "type": "String"
      },
      "prosjektnr": {
        "type": "Number"
      },
      "status": {
        "type": "String"
      },
      "body": {
        "type": "String"
      },
      "template": {
        "type": "String"
      },
    "stats": {
      "affectedCount": {
        "type": "Number"
      },
      "totalOwners": {
        "type": "Number"
      },
      "privateOwners": {
        "type": "Number"
      },
      "businessOwners": {
        "type": "Number"
      }
    },
    "matrikkelEnheter": {
      "type": [
        "Mixed"
      ]
    },
    "polygon": {
      "coordinatesystem": {
        "type": "String"
      },
      "filename": {
        "type": "String"
      },
      "area": {
        "type": "Number"
      },
      "vertices": {
        "type": [
          "Array"
        ]
        },
      "extremes": {
        "north": {
            "type": [
            "Number"
          ]
        },
        "west": {
          "type": [
            "Number"
            ]
        },
        "east": {
          "type": [
            "Number"
          ]
        },
        "south": {
            "type": [
            "Number"
          ]
        },
        "center": {
          "type": [
            "Number"
            ]
        }
      }
    },
        "geopolygon": {
      "coordinateSystem": {
        "type": "String"
        },
      "vertices": {
        "type": [
            "Array"
        ]
      },
      "extremes": {
        "north": {
          "type": [
            "Number"
            ]
        },
        "west": {
          "type": [
            "Number"
          ]
        },
        "east": {
            "type": [
            "Number"
          ]
        },
        "south": {
          "type": [
            "Number"
            ]
        },
        "center": {
          "type": [
            "Number"
          ]
        }
      }
    },
    "createdDate": {
        "type": "Date"
    },
    "createdBy": {
        "type": "String"
    },
    "createdById": {
        "type": "String"
    },
    "modifiedDate": {
        "type": "Date"
    },
    "modifiedBy": {
        "type": "String"
    },
    "modifiedById": {
        "type": "String"
    }
})

const Dispatches = mongoose.model('Dispatches', dispatchesSchema)

module.exports = Dispatches