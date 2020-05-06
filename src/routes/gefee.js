const gefee = require('../libs/gefee-sdk');

const requiresSession = require('../middlewares/requiresSession');

module.exports = server => {

  server.get('/api/gefee/test', requiresSession, async (req, res) => {

    res.send(gefee.UserProfile.Email);

  });

  server.get('/api/gefee/login', async (req, res) => {
    try {

      const result = await gefee.getSession();
      res.json(result);

    } catch (err) {

      console.error(err);
      res.send('Cound not login...');

    }
  });

};