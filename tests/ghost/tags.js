const expect = require('chai').expect;
const Tags = require('../../lib/ghost/tags');

describe('lib/ghost/tags', () => {

  it('should be available', () => {
    expect(Tags).to.be.an('object');
  });

  describe('isBeingUsed()', () => {
    it('is available', () => {
      expect(Tags.isBeingUsed).to.be.an('function');
    });

    it('should return TRUE when is used as feature_image', () => {
      let error;
      let output;
      try {
        const tags = [
          { feature_image: '/uploads/same_image.jpg' }
        ];
        const upload = {
          path: 'same_image.jpg'
        };
        output = Tags.isBeingUsed(upload, tags);
      } catch (err) {
        error = err;
      } finally {
        expect(error).to.be.undefined;
        expect(output).to.equal(true);
      }
    });

    it('should return FALSE when is not used as feature_image', () => {
      let error;
      let output;
      try {
        const tags = [
          { feature_image: '/uploads/old_image.jpg' }
        ];
        const upload = {
          path: 'same_image.jpg'
        };
        output = Tags.isBeingUsed(upload, tags);
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
      expect(Tags.list).to.be.an('function');
    });
  });
});
