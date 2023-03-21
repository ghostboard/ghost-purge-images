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
      let error;
      let output;
      try {
        output = await Uploads.list(['tests']);
      } catch (err) {
        error = err;
      } finally {
        expect(error).to.be.undefined;
        expect(typeof output === 'object').to.equal(true);
        expect(output.length).to.be.an('number');
        expect(output[0]).to.have.property('path');
        expect(output[0]).to.have.property('size');
      }
    });

		it('should exclude the images/size folder', async () => {
		  let error;
		  let output;
		  try {
			  output = await Uploads.list(['tests/ghost/images']);
		  } catch (err) {
			  error = err;
		  } finally {
			  expect(error).to.be.undefined;
			  expect(typeof output === 'object').to.equal(true);
			  expect(output.length).to.be.an('number');
			  expect(output[0]).to.have.property('path');
			  expect(output[0]).to.have.property('size');
				output.map((item) => {
					expect(item.path.includes('images/size')).eq(false);
				});
		  }
	  });
  });

  describe('remove()', () => {
    it('is available', () => {
      expect(Uploads.remove).to.be.an('function');
    });
  });
});
