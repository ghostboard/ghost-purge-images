const expect = require('chai').expect;
const Posts = require('../../lib/ghost/posts');

describe('lib/ghost/posts', () => {

  it('should be available', () => {
    expect(Posts).to.be.an('object');
  });

  describe('isBeingUsed()', () => {
    it('is available', () => {
      expect(Posts.isBeingUsed).to.be.an('function');
    });

    it('should return TRUE when is used on html', () => {
      let error;
      let output;
      try {
        const posts = [
          { html: '<img src="/uploads/same_image.jpg" />' }
        ];
        const upload = {
          path: 'same_image.jpg'
        };
        output = Posts.isBeingUsed(upload, posts);
      } catch (err) {
        error = err;
      } finally {
        expect(error).to.be.undefined;
        expect(output).to.equal(true);
      }
    });

    it('should return TRUE when is used as feature_image', () => {
      let error;
      let output;
      try {
        const posts = [
          { feature_image: '/uploads/same_image.jpg' }
        ];
        const upload = {
          path: 'content/images/same_image.jpg'
        };
        output = Posts.isBeingUsed(upload, posts);
      } catch (err) {
        error = err;
      } finally {
        expect(error).to.be.undefined;
        expect(output).to.equal(true);
      }
    });

    it('should return TRUE when is used as openGraph image', () => {
      let error;
      let output;
      try {
        const posts = [
          { og_image: '/uploads/same_image.jpg' }
        ];
        const upload = {
          path: 'content/images/same_image.jpg'
        };
        output = Posts.isBeingUsed(upload, posts);
      } catch (err) {
        error = err;
      } finally {
        expect(error).to.be.undefined;
        expect(output).to.equal(true);
      }
    });

    it('should return TRUE when is used as twitter image', () => {
      let error;
      let output;
      try {
        const posts = [
          { twitter_image: '/uploads/same_image.jpg' }
        ];
        const upload = {
          path: 'content/images/same_image.jpg'
        };
        output = Posts.isBeingUsed(upload, posts);
      } catch (err) {
        error = err;
      } finally {
        expect(error).to.be.undefined;
        expect(output).to.equal(true);
      }
    });

    it('should return FALSE when is not used on html', () => {
      let error;
      let output;
      try {
        const posts = [
          { html: '<img src="/uploads/old_image.jpg" />' }
        ];
        const upload = {
          path: 'content/images/same_image.jpg'
        };
        output = Posts.isBeingUsed(upload, posts);
      } catch (err) {
        error = err;
      } finally {
        expect(error).to.be.undefined;
        expect(output).to.equal(false);
      }
    });

    it('should return FALSE when is not used as feature_image', () => {
      let error;
      let output;
      try {
        const posts = [
          { feature_image: '/uploads/old_image.jpg' }
        ];
        const upload = {
          path: 'content/images/same_image.jpg'
        };
        output = Posts.isBeingUsed(upload, posts);
      } catch (err) {
        error = err;
      } finally {
        expect(error).to.be.undefined;
        expect(output).to.equal(false);
      }
    });

    it('should return FALSE when is not used as openGraph image', () => {
      let error;
      let output;
      try {
        const posts = [
          { og_image: '/uploads/old_image.jpg' }
        ];
        const upload = {
          path: 'content/images/same_image.jpg'
        };
        output = Posts.isBeingUsed(upload, posts);
      } catch (err) {
        error = err;
      } finally {
        expect(error).to.be.undefined;
        expect(output).to.equal(false);
      }
    });

    it('should return FALSE when is not used as twitter image', () => {
      let error;
      let output;
      try {
        const posts = [
          { twitter_image: '/uploads/old_image.jpg' }
        ];
        const upload = {
          path: 'content/images/same_image.jpg'
        };
        output = Posts.isBeingUsed(upload, posts);
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
      expect(Posts.list).to.be.an('function');
    });
  });
});
