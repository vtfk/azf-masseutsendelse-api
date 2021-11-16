const mongoose = require('mongoose')

const templateSchema = new mongoose.Schema ({
  "name": {
    "type": "String"
  },
  "description": {
    "type": "String"
  },
  "enabled": {
    "type": "Boolean"
  },
  "language": {
    "type": "String"
  },
  "documentTemplate": {
    "id": {
      "type": "String"
    },
    "language": {
      "type": "String"
    },
    "data": {
      "info": {
        "our-reference": {
          "type": "String"
        }
      }
    }
  },
  "template": {
    "type": "String"
  },
  "data": {},
  "created_timestamp": {
    "type": "Date"
  },
  "modified_timestamp": {
    "type": "Date"
  },
  "created_by": {
    "type": "String"
  },
  "modified_by": {
    "type": "String"
  }  
})

const Templates = mongoose.model('Templates', templateSchema)

module.exports = Templates