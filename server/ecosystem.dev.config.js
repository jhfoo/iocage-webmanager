module.exports = {
    apps: [{
        name: "iocage-mgr-svr-dev",
        script: 'src/server.js',
        // args: ['src/server.js'],
        watch: ['src']
    }]
};