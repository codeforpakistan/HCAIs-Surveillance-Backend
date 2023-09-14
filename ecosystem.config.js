module.exports = {
    apps: [
      {
        name: "hcai-backend",
        script: "yarn run watch",
      },
      {
        script: 'server.js',
        instances: 'max',
        exec_mode: 'cluster_mode' // not 'fork' or 'cluster'
      }
    ],
    deploy: {
      production: {
        user: "ubuntu",
        host: "18.141.220.82",
        path: "/home/ubuntu/hcais",
        repo: "https://github.com/codeforpakistan/HCAIs-Surveillance-Backend.git",
        ref: "origin/main",
        key: "~/.ssh/hcai.pem",
        "post-deploy": "pm2 startOrRestart ecosystem.config.js --name hcai-backend",
      },
    },
  };