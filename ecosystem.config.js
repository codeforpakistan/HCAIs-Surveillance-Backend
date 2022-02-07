module.exports = {
    apps: [
      {
        name: "hcai-backend",
        script: "yarn run watch",
      },
    ],
    deploy: {
      production: {
        user: "ubuntu",
        host: "18.141.220.82",
        path: "/home/ubuntu/hcais",
        repo: "https://github.com/codeforpakistan/HCAIs-Surveillance-Backend.git",
        ref: "origin/main",
        key: "~/.ssh/hcai.pem",
        "post-deploy": "source ~/.nvm/nvm.sh && npm install -g yarn && yarn install && pm2 startOrRestart ecosystem.config.js --name hcai-backend",
      },
    },
  };