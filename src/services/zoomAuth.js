const axios = require('axios');
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const logger = require('../utils/logger');

class ZoomAuthService {
  constructor() {
    this.token = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    try {
      if (this.token && this.tokenExpiry > Date.now()) {
        return this.token;
      }

      const response = await axios.post('https://zoom.us/oauth/token', null, {
        params: {
          grant_type: 'client_credentials'
        },
        auth: {
          username: config.zoom.clientId,
          password: config.zoom.clientSecret
        }
      });

      this.token = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      
      return this.token;
    } catch (error) {
      logger.error('Failed to obtain Zoom access token:', error);
      throw error;
    }
  }

  verifyWebhook(payload, signature) {
    try {
      const message = `v0:${payload.timestamp}:${JSON.stringify(payload.payload)}`;
      const hash = jwt.sign(message, config.zoom.secretToken);
      return hash === signature;
    } catch (error) {
      logger.error('Webhook verification failed:', error);
      return false;
    }
  }
}

module.exports = new ZoomAuthService();