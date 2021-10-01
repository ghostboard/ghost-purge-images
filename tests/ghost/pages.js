const expect = require('chai').expect;
const auth = require('../../lib/ghost/auth');
const Pages = require('../../lib/ghost/pages');

describe('lib/ghost/pages', () => {

  it('should be available', () => {
    expect(Pages).to.be.an('object');
  });

  describe('isBeingUsed()', () => {
    it('is available', () => {
      expect(Pages.isBeingUsed).to.be.an('function');
    });
  });

  describe('list()', () => {
    it('is available', () => {
      expect(Pages.list).to.be.an('function');
    });

    if (process.env.TEST_BASE_URL) {
      it('should get the pages list', async () => {
        let error;
        let output;
        try {
          const input = {
            url: process.env.TEST_BASE_URL,
            authToken: auth.getToken(process.env.TEST_ADMIN_API_KEY)
          };
          output = await Pages.list(input);
        } catch (err) {
          error = err;
        } finally {
          expect(error).to.be.undefined;
          expect(output).to.be.an('array');
          expect(output.length).to.be.greaterThan(0);
          expect(output[0]).to.be.have.property('feature_image');
          expect(output[0]).to.be.have.property('og_image');
          expect(output[0]).to.be.have.property('twitter_image');
        }
      });
    }
  });
});
