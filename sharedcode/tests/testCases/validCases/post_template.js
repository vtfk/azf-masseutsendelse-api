module.exports = {
  headers: {
    'x-api-key': process.env.APIKEYS_TEST
  },
  body: {
    version: '1',
    createdBy: 'Jest Test',
    createdById: 'J35t T35t',
    createdByDepartment: 'Jest og Test',
    modifiedBy: 'Jest Test',
    modifiedById: 'J35t T35t',
    modifiedByDepartment: 'Jest og Test',
    name: 'Jest Test Template',
    description: 'Dette er en jest test',
    documentDefinitionId: '1337',
    template: 'Et eller annet'
  }
}
