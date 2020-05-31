const expect = require('chai').expect;
const Settings = require('../../lib/ghost/settings');

describe('lib/ghost/settings', () => {

  it('should be available', () => {
    expect(Settings).to.be.an('object');
  });

  describe('isBeingUsed()', () => {
    it('is available', () => {
      expect(Settings.isBeingUsed).to.be.an('function');
    });

    it('should return TRUE when is used on logo', () => {
      let error;
      let output;
      try {
        const settings = {
          logo: '/uploads/same_image.jpg'
        };
        const upload = {
          path: 'content/images/same_image.jpg'
        };
        output = Settings.isBeingUsed(upload, settings);
      } catch (err) {
        error = err;
      } finally {
        expect(error).to.be.undefined;
        expect(output).to.equal(true);
      }
    });

    it('should return FALSE when is not used on logo', () => {
      let error;
      let output;
      try {
        const settings = {
          logo: '/uploads/old_image.jpg'
        };
        const upload = {
          path: 'content/images/same_image.jpg'
        };
        output = Settings.isBeingUsed(upload, settings);
      } catch (err) {
        error = err;
      } finally {
        expect(error).to.be.undefined;
        expect(output).to.equal(false);
      }
    });

    it('should return TRUE when is used on cover image', () => {
      let error;
      let output;
      try {
        const settings = {
          cover_image: '/uploads/same_image.jpg'
        };
        const upload = {
          path: 'content/images/same_image.jpg'
        };
        output = Settings.isBeingUsed(upload, settings);
      } catch (err) {
        error = err;
      } finally {
        expect(error).to.be.undefined;
        expect(output).to.equal(true);
      }
    });

    it('should return FALSE when is not used on cover image', () => {
      let error;
      let output;
      try {
        const settings = {
          cover_image: '/uploads/old_image.jpg'
        };
        const upload = {
          path: 'content/images/same_image.jpg'
        };
        output = Settings.isBeingUsed(upload, settings);
      } catch (err) {
        error = err;
      } finally {
        expect(error).to.be.undefined;
        expect(output).to.equal(false);
      }
    });
  });

  describe('list()', () => {
    it('is available', () => {
      expect(Settings.list).to.be.an('function');
    });
  });
});
