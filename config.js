module.exports = {
  AZUREAD_TOKEN_CONFIG: {
    jwksUri: process.env.AZUREAD_JWK_URI,
    issuer: process.env.AZUREAD_ISSUER_URI,
    audience: process.env.AZUREAD_CLIENTID
  },
  AZUREAD_ALLOWEDGROUPS: process.env.AZUREAD_ALLOWEDGROUPS,
  APIKEYS: process.env.APIKEYS,
  APIKEYS_MINIMUM_LENGTH: process.env.APIKEYS_MINIMUM_LENGTH || 24
}