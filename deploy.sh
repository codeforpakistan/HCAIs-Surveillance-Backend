set -e

echo "Deploying the application ..."
source ~/.nvm/nvm.sh
npm install -g yarn
yarn instal
pm2 startOrRestart ecosystem.config.js --name hcai-backend
echo "Deployment complete."