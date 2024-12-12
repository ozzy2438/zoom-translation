const express = require('express');
const config = require('./config/config');
const logger = require('./utils/logger');
const ErrorHandler = require('./utils/errorHandler');
const authMiddleware = require('./middleware/auth');
const translationRoutes = require('./routes/translationRoutes');

const app = express();
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    translation: {
      source: config.translation.sourceLanguage,
      target: config.translation.targetLanguage
    }
  });
});

// Webhook endpoint for Zoom events
app.post('/webhook', async (req, res) => {
  const signature = req.headers['x-zoom-signature'];
  
  if (!signature || !zoomAuth.verifyWebhook(req.body, signature)) {
    logger.warn('Invalid webhook signature received');
    return res.status(401).json({ error: 'Invalid signature' });
  }

  try {
    const { event, payload } = req.body;
    
    if (event === 'meeting.started') {
      await captionService.connectToZoomMeeting(payload.meeting_id);
      logger.info(`Started English to Turkish translation for meeting ${payload.meeting_id}`);
    }

    res.status(200).json({ status: 'success' });
  } catch (error) {
    const errorResponse = ErrorHandler.handle(error, 'Webhook processing');
    res.status(500).json(errorResponse);
  }
});

// Protected translation routes
app.use('/api/translation', authMiddleware, translationRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  const errorResponse = ErrorHandler.handle(err, 'Server Error');
  res.status(500).json(errorResponse);
});

app.listen(config.server.port, () => {
  logger.info(`Translation server running on port ${config.server.port}`);
  logger.info('Ready to translate English captions to Turkish');
});

process.on('unhandledRejection', (error) => {
  ErrorHandler.handle(error, 'Unhandled Rejection');
});

process.on('uncaughtException', (error) => {
  ErrorHandler.handle(error, 'Uncaught Exception');
  process.exit(1);
});