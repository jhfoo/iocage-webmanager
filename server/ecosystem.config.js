module.exports = {
    apps: [{
        name: "iocage-mgr-svr-dev",
        script: 'src/server.js',
        // args: ['src/server.js'],
        watch: ['src']
    }],
    deploy: {
        development: {
            user: 'app',
            host: ['localhost'],
            ref: 'origin/master',
            repo: 'https://github.com/jhfoo/iocage-webmanager-server.git',
            path: '/home/app/iocage-webmanager-server',
            'post-deploy': 'npm i && pm2 startOrRestart ecosystem.config.js --env development --force',
            'post_deploy-local': 'echo Deploy completed',
            env: {
                NODE_ENV: 'development'
            }
        },
        production: {
            user: 'app',
            host: ['127.0.0.1'],
            ref: 'origin/master',
            repo: 'https://github.com/jhfoo/iocage-webmanager-server.git',
            path: '/home/app/iocage-webmanager-server',
            'post-deploy': 'npm i && pm2 startOrRestart ecosystem.config.js --env production --force',
            'post_deploy-local': 'echo Deploy completed',
            env: {
                NODE_ENV: 'development'
            }
        }
    }
};
