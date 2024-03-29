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

	  it('should exclude the .webp files', async () => {
		  let error;
		  let output;
			const EXCLUDED_EXTENSIONS = ['webp'];
		  try {
			  output = await Uploads.list(['tests/ghost/images'], EXCLUDED_EXTENSIONS);
		  } catch (err) {
			  error = err;
		  } finally {
			  expect(error).to.be.undefined;
			  output.map((item) => {
				  expect(item.path.includes(EXCLUDED_EXTENSIONS[0])).eq(false);
			  });
		  }
	  });

	  it('should exclude more than 1 extension casting from string', async () => {
		  let error;
		  let output;
		  const EXCLUDED_EXTENSIONS = 'jpg,webp';
		  try {
			  output = await Uploads.list(['tests/ghost/images'], EXCLUDED_EXTENSIONS);
		  } catch (err) {
			  error = err;
		  } finally {
			  expect(error).to.be.undefined;
			  output.map((item) => {
				  EXCLUDED_EXTENSIONS.forEach((extension) => {
					  expect(item.path.includes(extension)).eq(false);
				  });
			  });
		  }
	  });

	  it('should exclude more than 1 extension', async () => {
		  let error;
		  let output;
		  const EXCLUDED_EXTENSIONS = ['jpg', 'webp'];
		  try {
			  output = await Uploads.list(['tests/ghost/images'], EXCLUDED_EXTENSIONS);
		  } catch (err) {
			  error = err;
		  } finally {
			  expect(error).to.be.undefined;
			  output.map((item) => {
				  EXCLUDED_EXTENSIONS.forEach((extension) => {
					  expect(item.path.includes(extension)).eq(false);
				  });
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
