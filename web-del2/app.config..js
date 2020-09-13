module.exports = {
    service: {
        PORT: 8088,
        host: '192.168.0.19'
    },
    ServiceBaseUrl: "https://192.168.0.19:8443",
    AppName: 'My App Title',
    production: {
        service: {
            PORT: 8089,
            host: '0.0.0.0'
        }
    },
}
