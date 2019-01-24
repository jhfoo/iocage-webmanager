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

router.get('/list/:template', (req, res, next) => {
    logger.info('GET {iocage}/list');
    let ListParam = req.params.template === 'template' ? '-t' : '';

    child_process.exec('iocage list ' + ListParam, (err, stdout, stderr) => {
        if (err) {
            res.send(err);
            next();
        } else {
            logger.debug(stdout);
            let re = /\|\s+(\S+)\s+\|\s+(\S+)\s+\|\s+(\S+)\s+\|\s+(\S+)\s+\|\s+(\S+)\s+\|/g;
            let match;
            let count = 0;
            let ret = [];
            while ((match = re.exec(stdout)) !== null) {
                if (count > 0) {
                    let record = {
                        id: match[1],
                        name: match[2],
                        state: match[3],
                        release: match[4],
                        ipv4: match[5]
                    };
                    ret.push(record);
                    logger.debug('Match: %s, %s, %s, %s, %s', record.id, record.name, record.state, record.release, record.ip4);
                }
                count++;
            }
            res.send(ret);
            next();
        }
    });
});

router.get('/property/:jailname/:property', (req, res, next) => {
    logger.info('GET {iocage}/property');
    child_process.exec('iocage get ' + req.params.property + ' ' + req.params.jailname, (err, stdout, stderr) => {
        if (err) {
            res.send(err);
            logger.error(err.message);
            logger.error(stderr);
            next();
        } else {
            let ret;
            if (req.params.property === 'all') {
                logger.debug(stdout);
                ret = stdout.split('\n').reduce((acc, line) => {
                    let re = /(\S+):(\S+)/;
                    let match;
                    if ((match = re.exec(line)) !== null) {
                        // logger.info('Match %s = %s', match[1], match[2]);
                        let value = match[2].match(/^\d+$/) ? parseInt(match[2]) : match[2];
                        acc[match[1]] = value;
                    }
                    return acc;
                }, {});
            } else {
                ret = {};
                let value = stdout.trim();
                ret[req.params.property] = value.match(/^\d+$/) ? parseInt(value) : value;
            }
            res.send(ret);
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