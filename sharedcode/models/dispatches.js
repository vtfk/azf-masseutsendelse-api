const mongoose = require('mongoose')

const dispatchesSchema = new mongoose.Schema ({
      title: {
        type: String,
        required: true
      },
      projectnumber: {
        type: String,
        required: true
      },
      status: {
        type: String,
        default: "notapproved",
        enum: ["notapproved", "approved", "inprogress", "completed" ],
        required: true
      },
      template: {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true
        },
        version: {
          type: Number,
          required: true
        },
        name: {
          type: String,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        language: {
          type: String,
          default: 'nb'
        },
        documentDefinitionId: {
          type: String
        },
        documentData: {
          type: Object,
        },
        data: {
          type: Object,
        },
        template: {
          type: String,
          required: true
        }
      },
      templateData: [
        Object
      ],
    stats: {
      affectedCount: {
        type: Number,
        required: true
      },
      area:{
        type: Number,
        required: true
      },
      totalOwners: {
        type: Number,
        required: true
      },
      privateOwners: {
        type: Number,
        required: true
      },
      businessOwners: {
        type: Number,
        required: true
      },
      units: [
        Object
      ]
    },
    matrikkelEnheter: {
      required: true,
      type: [
        Object
      ]
    },
    polygon: {
      coordinatesystem: {
        type: String,
        required: true
      },
      filename: {
        type: String,
        required: true
      },
      area: {
        type: Number,
        required: true
      },
      vertices: {
        required: true,
        type: [
          Array
        ]
        },
      extremes: {
        north: {
          required: true,
            type: [
            Number,
          ]
        },
        west: {
          required: true,
          type: [
            Number
            ]
        },
        east: {
          required: true,
          type: [
            Number
          ]
        },
        south: {
          required: true,
            type: [
            Number
          ]
        },
        center: {
          required: true,
          type: [
            Number
            ]
        }
      }
    },
        geopolygon: {
      coordinateSystem: {
        required: true,
        type: String
        },
      vertices: {
        required: true,
        type: [
            Array
        ]
      },
      extremes: {
        north: {
          required: true,
          type: [
            Number
            ]
        },
        west: {
          required: true,
          type: [
            Number
          ]
        },
        east: {
          required: true,
            type: [
            Number
          ]
        },
        south: {
          required: true,
          type: [
            Number
            ]
        },
        center: {
          required: true,
          type: [
            Number
          ]
        }
      }
    },
    createdTimestamp: {
        type: Date,
        default: new Date,
        required: true
    },
    createdBy: {
        type: String,
        default: "André Noen",
        required: true
    },
    createdById: {
        type: String,
        default: "00000000-0000-0000-0000-000000000000",
        required: true
    },
    modifiedTimestamp: {
        type: Date,
        default: new Date,
        required: true
    },
    modifiedBy: {
        type: String,
        default: "Noen André",
        required: true
    },
    modifiedById: {
        type: String,
        default: "00000000-0000-0000-0000-000000000000",
        required: true
    }
})

const Dispatches = mongoose.model('Dispatches', dispatchesSchema)

module.exports = Dispatches