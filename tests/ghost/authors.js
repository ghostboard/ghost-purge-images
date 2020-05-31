const expect = require('chai').expect;
const Authors = require('../../lib/ghost/authors');

describe('lib/ghost/authors', () => {

  it('should be available', () => {
    expect(Authors).to.be.an('object');
  });

  describe('isBeingUsed()', () => {
    it('is available', () => {
      expect(Authors.isBeingUsed).to.be.an('function');
    });

    it('should return TRUE when is used as profile_image', () => {
      let error;
      let output;
      try {
        const authors = [
          { profile_image: '/uploads/same_image.jpg' }
        ];
        const upload = {
          path: 'content/images/same_image.jpg'
        };
        output = Authors.isBeingUsed(upload, authors);
      } catch (err) {
        error = err;
      } finally {
        expect(error).to.be.undefined;
        expect(output).to.equal(true);
      }
    });

    it('should return FALSE when is not used as profile_image', () => {
      let error;
      let output;
      try {
        const authors = [
          { profile_image: '/uploads/old_image.jpg' }
        ];
        const upload = {
          path: 'content/images/same_image.jpg'
        };
        output = Authors.isBeingUsed(upload, authors);
      } catch (err) {
        error = err;
      } finally {
        expect(error).to.be.undefined;
        expect(output).to.equal(false);
      }
    });

    it('should return TRUE when is used as cover_image', () => {
      let error;
      let output;
      try {
        const authors = [
          { cover_image: '/uploads/same_image.jpg' }
        ];
        const upload = {
          path: 'content/images/same_image.jpg'
        };
        output = Authors.isBeingUsed(upload, authors);
      } catch (err) {
        error = err;
      } finally {
        expect(error).to.be.undefined;
        expect(output).to.equal(true);
      }
    });

    it('should return FALSE when is not used as cover_image', () => {
      let error;
      let output;
      try {
        const authors = [
          { cover_image: '/uploads/old_image.jpg' }
        ];
        const upload = {
          path: 'content/images/same_image.jpg'
        };
        output = Authors.isBeingUsed(upload, authors);
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
      expect(Authors.list).to.be.an('function');
    });
  });
});
