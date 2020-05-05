const axios = require('axios');
const nodeRSA = require('node-rsa');
const crypto = require('crypto');

const isObjectEmpty = obj => {
  for(var key in obj) {
    if(obj.hasOwnProperty(key))
        return false;
}
return true;
};

const gefee = {
  get: async (url_path, param_object) => {
    let params = '';
    if (!isObjectEmpty(param_object)) {
      for (let [key, value] of Object.entries(param_object)) {
        if (key === 'appKey'
            || key === 'AppKey'
            || key === 'app_key') {
          params += `${key}=${value}`;
        } else {
          params += `&${key}=${value}`;
        }
      }
    }
    return await axios.get(`${process.env.GEFEE_API_URL}${url_path}?${params}`);
  }
};


module.exports = server => {

  server.get('/api/gefee/login', async (req, res) => {
    try {

      //! SERVER
      const session = await gefee.get(process.env.ENDPOINT_GET_PING, {
        AppKey: process.env.GEFFEE_APP_KEY
      });
      //! !SERVER

      //? TEST
      // const session = {
      //   data: {
      //     Result: {
      //       SessionKey: "947F787EA4C77C57E8942BB97F4403FB",
      //       Key: {
      //         Modulus: "EBBE901BFBD82F31F487F8A627C17C5AB2F9D115E168D0D8DE37951CDD0937AC531DD11B6FBD94ADC307C07B4DFC7238210A4C6DC6960816DC9991D263AEA4D222F5E2AAE38C1188911BADD56CDFC67D74D9FB50D4D494E2307013024A378CF3E923FB5764FED6D4A4F4D7B9FE9C23C4EE399FEAF823F88BC50C1C4D1136739F1D310D3565E76BC3C44562E517518F4CCDFC1BDBFC8D0049691773D6AF1BB4EE883E71BF1D9739FC8FED4C3CAD92BDDA68915A249B25C2EDC51CDD02B7506CF41109220704090A5F5857524BBCF5931445C2430A600E61E8C4ECCF7FFD8E84D8E3F3B2169A50F47C03F13A22EB3880C39CE7942DC37D473495EA0A69751FE25D",
      //         Exponent: "010001"
      //       }
      //     }
      //   }
      // }
      //? !TEST

      const { SessionKey, Key } = session.data.Result;

      const clearText = `{"Username":"${process.env.GEFEE_USERNAME}","Password":"${process.env.GEFEE_PASSWORD}","Key":null,"Culture":"ro"}`;
      const keyData = Buffer.from(clearText, 'utf8');


      const key = new nodeRSA({
        e: Number(Key.Exponent),
        n: Buffer.from(Key.Modulus, 'hex')
      }, 'components-public');

      key.setOptions({
        environment:'node',
        encryptionScheme: {
          scheme: 'pkcs1',
          padding: crypto.constants.RSA_PKCS1_PADDING
        }
      });

      console.error(key);

      const credentials = key.encrypt(keyData, 'hex');

      console.error(credentials);

      //! SERVER
      const response = await gefee.get(process.env.ENDPOINT_GET_LOGIN, {
        AppKey: process.env.GEFFEE_APP_KEY,
        SessionKey: SessionKey,
        Credentials: credentials
      });


      // console.error(response);
      res.json(response.data);
      //! !SERVER

      //? TEST
      // res.json(credentials);
      //? !TEST

    } catch (err) {

      console.error(err);
      res.send('Cound not login...');

    }
  });












  // server.get('/api/gefee/login', async (req, res) => {
  //   try {

  //     //! SERVER
  //     const session = await gefee.get(process.env.ENDPOINT_GET_PING, {
  //       AppKey: process.env.GEFFEE_APP_KEY
  //     });
  //     //! !SERVER

  //     //? TEST
  //     // const session = {
  //     //   data: {
  //     //     Result: {
  //     //       SessionKey: "947F787EA4C77C57E8942BB97F4403FB",
  //     //       Key: {
  //     //         Modulus: "EBBE901BFBD82F31F487F8A627C17C5AB2F9D115E168D0D8DE37951CDD0937AC531DD11B6FBD94ADC307C07B4DFC7238210A4C6DC6960816DC9991D263AEA4D222F5E2AAE38C1188911BADD56CDFC67D74D9FB50D4D494E2307013024A378CF3E923FB5764FED6D4A4F4D7B9FE9C23C4EE399FEAF823F88BC50C1C4D1136739F1D310D3565E76BC3C44562E517518F4CCDFC1BDBFC8D0049691773D6AF1BB4EE883E71BF1D9739FC8FED4C3CAD92BDDA68915A249B25C2EDC51CDD02B7506CF41109220704090A5F5857524BBCF5931445C2430A600E61E8C4ECCF7FFD8E84D8E3F3B2169A50F47C03F13A22EB3880C39CE7942DC37D473495EA0A69751FE25D",
  //     //         Exponent: "010001"
  //     //       }
  //     //     }
  //     //   }
  //     // }
  //     //? !TEST

  //     const { SessionKey, Key } = session.data.Result;

  //     const clearText = `{"Username":"${process.env.GEFEE_USERNAME}","Password":"${process.env.GEFEE_PASSWORD}","Key":null,"Culture":"ro"}`;
  //     const keyData = Buffer.from(clearText, 'utf8');


  //     const key = new nodeRSA({
  //       e: Number(Key.Exponent),
  //       n: Buffer.from(Key.Modulus, 'hex')
  //     }, 'components-public');

  //     // key.setOptions({
  //     //   environment:'node',
  //     //   encryptionScheme: {
  //     //     scheme: 'pkcs1',
  //     //     padding: crypto.constants.RSA_PKCS1_PADDING
  //     //     // toString: function() {
  //     //     //   return 'pkcs1-nopadding'
  //     //     // }
  //     //   }
  //     // });

  //     // console.error(key);

  //     const publicKey = key.exportKey('pkcs1-public');

  //     const encrypted = crypto.publicEncrypt(publicKey, keyData);
  //     const credentials = encrypted.toString('hex');

  //     // const credentials = key.encrypt(keyData, 'hex');

  //     console.error(credentials);




  //     //! SERVER
  //     const response = await gefee.get(process.env.ENDPOINT_GET_LOGIN, {
  //       AppKey: process.env.GEFFEE_APP_KEY,
  //       SessionKey: SessionKey,
  //       Credentials: credentials
  //     });


  //     // console.error(response);
  //     res.json(response.data);
  //     //! !SERVER

  //     //? TEST
  //     // res.json(credentials);
  //     //? !TEST

  //   } catch (err) {

  //     console.error(err);
  //     res.send('Cound not login...');

  //   }
  // });


};