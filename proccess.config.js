module.exports = {
  apps: [{
    name: "hcai-backend",
    script: "npm",
    args: "run prod",
    instances: "3",
    exec_mode: "cluster"
  }]
}