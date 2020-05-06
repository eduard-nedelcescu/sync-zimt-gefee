const gefee = require('../libs/gefee-sdk');

module.exports = async (req, res, next) => {
  if (gefee.AuthenticationToken && gefee.UserProfile) {
    next();
  } else {
      try {
        await gefee.getSession();
        next();
      } catch (err) {
        console.error(err);
        res.status(500).send('Could not get session...');
      }
  }

};
