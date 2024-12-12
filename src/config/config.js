require('dotenv').config();
const languages = require('./languages');

module.exports = {
  zoom: {
    clientId: process.env.ZOOM_CLIENT_ID,
    clientSecret: process.env.ZOOM_CLIENT_SECRET,
    secretToken: process.env.ZOOM_SECRET_TOKEN,
    verificationToken: process.env.ZOOM_VERIFICATION_TOKEN
  },
  translation: {
    sourceLanguage: languages.source,
    targetLanguage: languages.target
  },
  server: {
    port: process.env.PORT || 3000
  }
};