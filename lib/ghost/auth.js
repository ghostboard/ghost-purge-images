const jwt = require('jsonwebtoken');

module.exports = {
  getToken(adminKey) {
    const [id, secret] = adminKey.split(':');
    const token = jwt.sign({}, Buffer.from(secret, 'hex'), {
      keyid: id,
      algorithm: 'HS256',
      expiresIn: '5m',
      audience: '/v2/admin/'
    });
    return token;
  }
};
