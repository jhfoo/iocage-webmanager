module.exports = {
  "devServer": {
    host: '192.168.70.1',
    "port": 8088,
    "https": true,
    "key": process.cwd() + '/certs/dell1850.key',
    cert: process.cwd() + '/certs/dell1850.crt'
  },
  "transpileDependencies": [
    "vuetify"
  ]
}