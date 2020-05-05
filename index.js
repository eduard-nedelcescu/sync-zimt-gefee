require('dotenv').config();
const server = require('./src/server');

const port = process.env.PORT || 3001;
server.listen(port, '127.0.0.1', () => {
  console.log(`Server running on PORT: ${port}...`);
});