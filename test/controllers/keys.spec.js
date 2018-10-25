import createKeysController from '../../src/controllers/keys';

describe('Keys Controller', () => {
  let qs;
  let key;
  let callback;
  let controller;
  let phraseappService;

  beforeEach(() => {
    key = 'some-data-key';
    callback = sinon.stub();
    qs = {
      stringify: sinon.stub().returns('query%20string'),
    };
    phraseappService = {
      getWToken: sinon.stub().returns(true),
      postSigned: sinon.stub().returns(true),
      patchSigned: sinon.stub().returns(true),
      deleteSigned: sinon.stub().returns(true),
    };

    controller = createKeysController({ phraseappService, qs });
  });

  describe('get', () => {
    it('should be called with "/keys" prefix', () => {
      controller.get(callback);
      expect(phraseappService.getWToken).calledOnceWith('/keys', callback);
    });
  });

  describe('post', () => {
    it('should be called with "/keys" prefix', () => {
      controller.post(key, callback);
      expect(phraseappService.postSigned).calledOnceWith('/keys', { key }, callback);
    });
  });

  describe('upload', () => {
    it('should be called with "/keys/upload" prefix', () => {
      controller.upload(key, callback);
      expect(phraseappService.postSigned).calledOnceWith('/keys/upload', key, callback);
    });
  });

  describe('patch', () => {
    it('should be called with "/keys/id" prefix', () => {
      controller.patch('id', key, callback);
      expect(phraseappService.patchSigned).calledOnceWith('/keys/id', { key }, callback);
    });
  });

  describe('delete', () => {
    it('should be called with "/keys/id" prefix', () => {
      controller.delete('id', callback);
      expect(phraseappService.deleteSigned).calledOnceWith('/keys/id', callback);
    });
  });

  describe('deleteMultiple', () => {
    it('should be called with "/keys/destroy_multiple?query%20string" prefix', () => {
      controller.deleteMultiple(['id-1', 'id-2'], callback);
      const signedPath = '/keys/destroy_multiple?query%20string';
      expect(phraseappService.deleteSigned).calledOnceWith(signedPath, callback);
    });
  });

  describe('getUntranslated', () => {
    it('should be called with "/keys/untranslated" prefix', () => {
      controller.getUntranslated(callback);
      expect(phraseappService.getWToken).calledOnceWith('/keys/untranslated', callback);
    });
  });

  describe('postTags', () => {
    it('should be called with "/keys/tag" prefix', () => {
      controller.postTags(key, callback);
      expect(phraseappService.postSigned).calledOnceWith('/keys/tag', key, callback);
    });
  });

  describe('getTranslation', () => {
    it(`should be called with "/keys/translate?key=${key}" prefix`, () => {
      controller.getTranslation(key, callback);
      expect(phraseappService.getWToken).calledOnceWith(`/keys/translate?key=${key}`, callback);
    });
  });
});
