const child_process = require('child_process'),
    assert = require('assert'),
    // sprintf = require('sprintf-js').sprintf,
    Router = require('restify-router').Router,
    router = new Router(),
    log4js = require('log4js'),
    logger = log4js.getLogger(),
    foobelt = require('foobelt'),
    Config = foobelt.ConfigReader('./src/Config.js')

const PROP_BOOLEAN = ['allow_raw_sockets', 'allow_tun', 'allow_vmm']

router.get('/ping', (req, res, next) => {
    res.send('pong')
    next();
});

router.get('/list/:template', (req, res, next) => {
    logger.info('GET {iocage}/list');
    let ListParam = req.params.template === 'template' ? '-t' : '';

    child_process.exec('iocage list ' + ListParam, (err, stdout, stderr) => {
        if (err) {
            res.send(err)
            next()
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
                    ret.push(record)
                    logger.debug('Match: %s, %s, %s, %s, %s', record.id, record.name, record.state, record.release, record.ip4)
                }
                count++;
            }
            res.send(ret)
            next()
        }
    })
})

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
                let LastKey = null
                ret = stdout.split('\n').reduce((acc, line) => {
                    let re = /(\S+):(.*)/;
                    let match;
                    if ((match = re.exec(line)) !== null) {
                        LastKey = match[1]
                        // logger.info('Match %s = %s', match[1], match[2]);
                        if (PROP_BOOLEAN.includes(LastKey)) {
                            acc[LastKey] = parseInt(match[2]) === true
                        } else if (LastKey === 'state') {
                            acc[LastKey] = match[2] === 'up'
                        } else {
                            let value = match[2].match(/^\d+$/) ? parseInt(match[2]) : match[2];
                            acc[LastKey] = value;
                        }
                    } else {
                        console.log('Multiple line: %s, %s', LastKey, line)
                        if (LastKey) {
                            acc[LastKey] += '\n' + line
                            console.log(acc[LastKey])
                        }
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

router.post('/property/:jailname/:property', (req, res, next) => {
    logger.info('POST {iocage}/property');
    logger.debug('jailname: ' + req.params.jailname)
    logger.debug('property: ' + req.params.property)
    logger.debug('property: ' + req.body.value)
    let cmd = `sudo iocage set ${req.params.property}="${req.body.value}" ${req.params.jailname}`
    logger.debug(cmd)
    child_process.exec(cmd, (err, stdout, stderr) => {
        if (err) {
            logger.error(err)
            res.send({
                status: 'ERROR',
                message: err.message
            });
            next();
        } else {
            logger.debug(stdout);
            res.send({
                status: 'OK',
                message: stdout
            });
            next();
        }
    });
    // res.send('OK');
    // next();
});

router.get('/start/:jailname', (req, res, next) => {
    logger.info('GET {iocage}/start');
    child_process.exec('sudo iocage start ' + req.params.jailname, (err, stdout, stderr) => {
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
    logger.info('GET {iocage}/stop');
    child_process.exec('sudo iocage stop ' + req.params.jailname, (err, stdout, stderr) => {
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