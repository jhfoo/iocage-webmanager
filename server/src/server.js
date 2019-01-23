const restify = require('restify'),
    corsMiddleware = require('restify-cors-middleware'),
    Router = require('restify-router').Router,
    router = new Router(),
    log4js = require('log4js'),
    logger = log4js.getLogger(),
    Config = require('./ConfigReader.js')('../Config.js');

logger.level = 'debug';

// secondary init
const server = restify.createServer();
const cors = corsMiddleware({
    origins:['*']
});
server.pre(cors.preflight);
server.use(cors.actual);

// config REST service
server.use(restify.plugins.bodyParser());
server.use(restify.plugins.queryParser({
    mapParams: false
}));

router.add('/iocage', require('./router-iocage'));
// router.add('/ui', require('./plugins/ui'));
router.applyRoutes(server);

server.listen(Config.service.port, function () {
    logger.debug('%s listening at %s', server.name, server.url);
});