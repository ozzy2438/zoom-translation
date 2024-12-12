const WebSocket = require('ws');
const logger = require('../utils/logger');
const translationService = require('./translationService');
const zoomAuth = require('./zoomAuth');

class CaptionService {
  constructor() {
    this.connections = new Map();
    this.reconnectAttempts = new Map();
  }

  async handleCaptionData(meetingId, text) {
    try {
      const translation = await translationService.translateText(text);
      this.broadcastTranslation(meetingId, translation);
      return translation;
    } catch (error) {
      logger.error('Caption processing failed:', error);
      throw error;
    }
  }

  async connectToZoomMeeting(meetingId) {
    try {
      const token = await zoomAuth.getAccessToken();
      const ws = new WebSocket(`wss://zoom.us/closedcaption/${meetingId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      this.setupWebSocketHandlers(ws, meetingId);
      this.connections.set(meetingId, ws);
      logger.info(`Connected to Zoom meeting ${meetingId}`);
    } catch (error) {
      logger.error('Failed to connect to Zoom meeting:', error);
      this.handleReconnection(meetingId);
    }
  }

  setupWebSocketHandlers(ws, meetingId) {
    ws.on('message', async (data) => {
      try {
        const caption = JSON.parse(data);
        await this.handleCaptionData(meetingId, caption.text);
      } catch (error) {
        logger.error('WebSocket message handling failed:', error);
      }
    });

    ws.on('close', () => {
      logger.info(`Connection closed for meeting ${meetingId}`);
      this.handleReconnection(meetingId);
    });

    ws.on('error', (error) => {
      logger.error('WebSocket error:', error);
      this.handleReconnection(meetingId);
    });
  }

  handleReconnection(meetingId) {
    const attempts = this.reconnectAttempts.get(meetingId) || 0;
    if (attempts < 3) {
      setTimeout(() => {
        this.reconnectAttempts.set(meetingId, attempts + 1);
        this.connectToZoomMeeting(meetingId);
      }, Math.pow(2, attempts) * 1000);
    } else {
      logger.error(`Failed to reconnect to meeting ${meetingId} after 3 attempts`);
      this.connections.delete(meetingId);
      this.reconnectAttempts.delete(meetingId);
    }
  }

  broadcastTranslation(meetingId, translation) {
    const ws = this.connections.get(meetingId);
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'caption',
        text: translation
      }));
    }
  }
}

module.exports = new CaptionService();