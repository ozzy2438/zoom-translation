const translationService = require('../services/translationService');

describe('TranslationService', () => {
  test('should translate text to supported language', async () => {
    const text = 'Hello World';
    const targetLanguage = 'es';
    
    const translation = await translationService.translateText(text, targetLanguage);
    expect(translation).toBeTruthy();
  });

  test('should throw error for unsupported language', async () => {
    const text = 'Hello World';
    const targetLanguage = 'xx';
    
    await expect(
      translationService.translateText(text, targetLanguage)
    ).rejects.toThrow();
  });

  test('should translate to multiple languages', async () => {
    const text = 'Hello World';
    const targetLanguages = ['es', 'fr', 'de'];
    
    const translations = await translationService.translateToMultipleLanguages(
      text,
      targetLanguages
    );
    
    expect(translations).toHaveLength(3);
    translations.forEach(translation => {
      expect(translation).toHaveProperty('language');
      expect(translation).toHaveProperty('translation');
    });
  });
});