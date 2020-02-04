const expect = require('chai').expect;
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
  });
});
