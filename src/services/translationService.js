const { Translate } = require('@google-cloud/translate').v2;
const logger = require('../utils/logger');
const config = require('../config/config');

class TranslationService {
  constructor() {
    this.translate = new Translate();
    this.sourceLanguage = config.translation.sourceLanguage;
    this.targetLanguage = config.translation.targetLanguage;
  }

  async translateText(text) {
    try {
      const [translation] = await this.translate.translate(text, {
        from: this.sourceLanguage,
        to: this.targetLanguage
      });
      
      logger.info(`Translated: "${text}" -> "${translation}"`);
      return translation;
    } catch (error) {
      logger.error('Translation failed:', error);
      throw error;
    }
  }
}

module.exports = new TranslationService();