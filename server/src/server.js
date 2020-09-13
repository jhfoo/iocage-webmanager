const fs = require('fs'),
    restify = require('restify'),
    corsMiddleware = require('restify-cors-middleware'),
    Router = require('restify-router').Router,
    router = new Router(),
    log4js = require('log4js'),
    logger = log4js.getLogger(),
    foobelt = require('foobelt'),
    Config = foobelt.ConfigReader('./src/Config.js');

logger.level = Config.log4js.level

// secondary init
// logger.debug(fs.readFileSync('./host.key'))
const server = restify.createServer({
    certificate: fs.readFileSync('./dell1850.crt'),
    key: fs.readFileSync('./dell1850.key'),
    httpsServerOptions: {

    }
})
const cors = corsMiddleware({
    origins: ['*']
})
server.pre(cors.preflight)
server.use(cors.actual)

// config REST service
server.use(restify.plugins.bodyParser())
server.use(restify.plugins.queryParser({
    mapParams: false
}))

router.add('/iocage', require('./router-iocage'));
// router.add('/ui', require('./plugins/ui'));
router.applyRoutes(server)

server.listen(Config.service.port, function () {
    logger.info('%s listening at %s', server.name, server.url);
})