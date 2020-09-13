module.exports = {
  "devServer": {
    host: '0.0.0.0',
    "port": 8088,
    "https": true,
    "key": process.cwd() + '/certs/dell1850.key',
    cert: process.cwd() + '/certs/dell1850.crt'
  },
  "transpileDependencies": [
    "vuetify"
  ]
}