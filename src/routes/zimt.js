const ZIMTHubSDK = require('@zimt/sdk').default;

const sdk = new ZIMTHubSDK({
  api: {
    core: process.env.ZIMT_CORE_URL,
  },
  privateKey: process.env.ZIMT_PRIVATE_KEY,
  apiKey: process.env.ZIMT_API_KEY,
});


module.exports = server => {

  // Assets
  server.get('/api/zimt/get_assets', async (req, res) => {
    try {

      const assets = await sdk.assets.getMany();
      res.json(assets);

    } catch (err) {

      console.error(err);
      res.send('Cound not fetch assets...');

    }
  });

  server.get('/api/zimt/get_asset/:asset_id', async (req, res) => {
    try {

      const asset = await sdk.assets.get(req.params.asset_id);
      res.json(asset);

    } catch (err) {

      console.error(err);
      res.send('Asset not found...');

    }
  });

  server.get('/api/zimt/create_asset', async (req, res) => {
    try {

      const result = await sdk.assets.create(sdk.assets.generateAsset());
      res.json(result);

    } catch (err) {
      console.error(err);
      res.send('Could not create new asset...');
    }
  });


  // Events
  server.get('/api/zimt/get_events/:asset_id', async (req, res) => {
    try {

      const result = await sdk.events.getEvents(req.params.asset_id);

      res.json(result);

    } catch (err) {

      console.error(err);
      res.send(`Could not get events for asset...`);

    }
  });

  server.get('/api/zimt/get_event/:asset_id/:event_id', async (req, res) => {
    try {

      const result = await sdk.events.getEvent(req.params.asset_id, req.params.event_id);

      res.json(result);

    } catch (err) {

      console.error(err);
      res.send(`Could not get event...`);

    }
  });

  server.post('/api/zimt/add_event', async (req, res) => {
    try {

      const { assetId, eventData } = req.body;

      const generatedEvent = sdk.events.generateEvent(assetId, eventData);
      const result = await sdk.events.createEvent(assetId, generatedEvent);

      res.json(result);

    } catch (err) {

      console.error(err);
      res.send(`Could not add event to asset...`);

    }
  });


  server.get('/api/zimt/help', async (req, res) => {
    try {


      const result = await sdk.organizations.getMany();

      res.json(result);

    } catch (err) {

      console.error(err);
      res.send(`Could not add event to asset...`);

    }
  });

};