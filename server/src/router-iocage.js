const assert = require('assert'),
    Router = require('restify-router').Router,
    router = new Router(),
    log4js = require('log4js'),
    logger = log4js.getLogger(),
    Config = require('./ConfigReader.js')('../Config.js');

router.get('/ping', (req, res, next) => {
    res.send('pong');
    next();
});
    
module.exports = router;