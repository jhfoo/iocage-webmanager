const child_process = require('child_process'),
    assert = require('assert'),
    Router = require('restify-router').Router,
    router = new Router(),
    log4js = require('log4js'),
    logger = log4js.getLogger(),
    Config = require('./ConfigReader.js')('../Config.js');

router.get('/ping', (req, res, next) => {
    res.send('pong');
    next();
});

router.get('/list', (req, res, next) => {
    child_process.exec('iocage list', (err, stdout, stderr) => {
        if (err) {
            res.send(err);
            next();
        } else {
            logger.debug(stdout);
            res.send(stdout);
            next();
        }
    });
});

router.get('/start/:jailname', (req, res, next) => {
    child_process.exec('iocage start ' + req.params.jailname, (err, stdout, stderr) => {
        if (err) {
            res.send(err);
            next();
        } else {
            logger.debug(stdout);
            res.send(stdout);
            next();
        }
    });
});

router.get('/stop/:jailname', (req, res, next) => {
    child_process.exec('iocage stop ' + req.params.jailname, (err, stdout, stderr) => {
        if (err) {
            res.send(err);
            next();
        } else {
            logger.debug(stdout);
            res.send(stdout);
            next();
        }
    });
});

module.exports = router;