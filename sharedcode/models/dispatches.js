const mongoose = require('mongoose')

/*
  Subschemas
*/
// Dispatch template
const dispatchTemplateSchema = new mongoose.Schema ({
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
    type: String
  }
})

// Polygon
const polygonSchema = new mongoose.Schema({
  EPSG: {
    type: String,
    required: true
  },
  area: {
    type: Number,
    required: true
  },
  center: {
    type: [Number],
    required: true
  },
  extremes: {
    north: {
      type: [Number],
      required: true
    },
    west: {
      type: [Number],
      required: true
    },
    east: {
      type: [Number],
      required: true
    },
    south: {
      type: [Number],
      required: true
    }
  },
  vertices: []
})

// Attachment
const attachmentSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: String,
  size: Number,
  lastModified: Number,
  lastModifiedDate: String
}, { _id: false })
/*
  Model schema
*/
const dispatchesSchema = new mongoose.Schema ({
    title: {
      type: String,
      required: true
    },
    projectnumber: {
      type: String,
      required: true
    },
    archivenumber: {
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
      type: dispatchTemplateSchema
    },
    templateData: {
      Object
    },
    attachments: [ attachmentSchema ],
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
    owners: {
      required: true,
      type: [ Object ]
    },
    excludedOwners: {
      type: [ Object ]
    },
    polygons: {
      EPSG: {
        type: String,
        required: true
      },
      // filename: {
      //   type: String,
      //   required: true
      // },
      area: {
        type: Number,
        required: true
      },
      center: {
        type: [Number],
        required: true
      },
      extremes: {
        north: {
          type: [Number],
          required: true
        },
        west: {
          type: [Number],
          required: true
        },
        east: {
          type: [Number],
          required: true
        },
        south: {
          type: [Number],
          required: true
        },
      },
      polygons: [{
        type: polygonSchema,
        validate: [(val) => val.length > 0]
      }]
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