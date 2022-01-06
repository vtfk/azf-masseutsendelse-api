module.exports = {
  AZUREAD_TOKEN_CONFIG: {
    jwksUri: process.env.AZUREAD_JWK_URI,
    issuer: process.env.AZUREAD_ISSUER_URI,
    audience: process.env.AZUREAD_CLIENTID
  },
  AZUREAD_ALLOWEDGROUPS: process.env.AZUREAD_ALLOWEDGROUPS
}