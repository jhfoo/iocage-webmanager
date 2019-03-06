const fs = require('fs');

module.exports = {
  devServer: {
    port: 8003,
    https: true,
    key: fs.readFileSync('../server/dell1850.key'),
    cert: fs.readFileSync('../server/dell1850.crt'),
  }
}
