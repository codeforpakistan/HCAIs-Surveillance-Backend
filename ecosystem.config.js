module.exports = {
    apps: [
      {
        name: "pm2-deploy",
        script: "index.js",
      },
    ],
    deploy: {
      production: {
        user: "ubuntu",
        host: "18.141.220.82",
        path: "/home/ubuntu/hcais",
        repo: "https://github.com/codeforpakistan/HCAIs-Surveillance-Backend.git",
        ref: "origin/main",
        key: "/Users/msohail/Downloads/hcai.pem",
        "post-deploy": "npm i; pm2 reload ecosystem.config.js --env production",
      },
    },
  };