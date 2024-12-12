const express = require('express');
const router = express.Router();
const captionService = require('../services/captionService');
const zoomAuth = require('../services/zoomAuth');
const logger = require('../utils/logger');
const ErrorHandler = require('../utils/errorHandler');

// Handle real-time captions
router.post('/captions', async (req, res) => {
  try {
    const { meetingId, text } = req.body;
    
    if (!meetingId || !text) {
      return res.status(400).json({ 
        error: 'Missing required fields: meetingId and text' 
      });
    }

    const translation = await captionService.handleCaptionData(meetingId, text);
    res.json({ translation });
  } catch (error) {
    const errorResponse = ErrorHandler.handle(error, 'Caption processing');
    res.status(500).json(errorResponse);
  }
});

// Meeting connection endpoint
router.post('/connect', async (req, res) => {
  try {
    const { meetingId } = req.body;
    
    if (!meetingId) {
      return res.status(400).json({ 
        error: 'Missing required field: meetingId' 
      });
    }

    await captionService.connectToZoomMeeting(meetingId);
    res.json({ 
      status: 'success', 
      message: 'Connected to meeting successfully' 
    });
  } catch (error) {
    const errorResponse = ErrorHandler.handle(error, 'Meeting connection');
    res.status(500).json(errorResponse);
  }
});

module.exports = router;