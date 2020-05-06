const gefee = require('../libs/gefee-sdk');

const requiresSession = require('../middlewares/requiresSession');

module.exports = server => {

  server.get('/api/gefee/test', requiresSession, async (req, res) => {

    res.send(gefee.UserProfile);

  });

  server.get('/api/gefee/login', async (req, res) => {
    try {

      const result = await gefee.getSession();
      res.json(result);

    } catch (err) {

      console.error(err);
      res.status(500).send('Cound not login...');

    }
  });

  server.get('/api/gefee/get_streets/:locality_id', requiresSession, async (req, res) => {
    try {
      const result = await gefee.get(process.env.ENDPOINT_GET_STREETS, {
        app_key: process.env.GEFFEE_APP_KEY,
        session_token: gefee.AuthenticationToken,
        locality_id: req.params.locality_id
      });

      res.json(result.data);

    } catch (err) {
      console.log(err);
      res.status(500).send('Could not find streets...')
    }
  });

  server.post('/api/gefee/add_partner_business', requiresSession, async (req, res) => {
    console.log(req.body);
    const base64BodyData = Buffer.from(JSON.stringify({data: req.body})).toString('base64');

    try {

      const response = await gefee.post(process.env.ENDPOINT_POST_BUSINESS_PARTNER_ADD, {
        app_key: process.env.GEFFEE_APP_KEY,
        session_token: gefee.AuthenticationToken,
      }, base64BodyData);

      res.json(response);

    } catch (err) {

      console.error(err);
      // res.status(500).send('Could not create business partner...');
      res.send(err);

    }
  });

};