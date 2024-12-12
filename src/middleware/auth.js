const zoomAuth = require('../services/zoomAuth');
const logger = require('../utils/logger');

module.exports = async (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    logger.warn('No authorization token provided');
    return res.status(401).json({ error: 'Authorization required' });
  }

  try {
    // Verify Zoom JWT token
    const isValid = await zoomAuth.verifyToken(token);
    if (!isValid) {
      logger.warn('Invalid authorization token');
      return res.status(401).json({ error: 'Invalid authorization token' });
    }
    
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
};