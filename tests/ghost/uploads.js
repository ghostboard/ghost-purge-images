const expect = require('chai').expect;
const Uploads = require('../../lib/ghost/uploads');

describe('lib/ghost/uploads', () => {

  it('should be available', () => {
    expect(Uploads).to.be.an('object');
  });

  describe('list()', () => {
    it('is available', () => {
      expect(Uploads.list).to.be.an('function');
    });

    it('should return an array with path and size', async () => {
      return Uploads.list('tests')
        .then((data) => {
          expect(typeof data === 'object').to.equal(true);
          expect(data.length).to.be.an('number');
          expect(data[0]).to.have.property('path');
          expect(data[0]).to.have.property('size');
        }).catch((err) => {
          throw new Error(err);
        });
    });
  });

  describe('remove()', () => {
    it('is available', () => {
      expect(Uploads.remove).to.be.an('function');
    });
  });
});
