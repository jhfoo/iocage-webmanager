module.exports = {
    apps: [{
        name: "iocage-mgr-web-dev",
        script: './node_modules/.bin/vue-cli-service',
        args: ['serve'],
        watch: ['src']
    }]
};