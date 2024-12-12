const logger = require('./logger');

class ErrorHandler {
  static handle(error, context = '') {
    logger.error(`${context}: ${error.message}`, {
      stack: error.stack,
      context
    });
    
    return {
      error: true,
      message: error.message,
      context
    };
  }
}

module.exports = ErrorHandler;