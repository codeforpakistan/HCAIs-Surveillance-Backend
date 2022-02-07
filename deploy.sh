set -e

echo "Deploying the application ..."
source ~/.nvm/nvm.sh
npm install -g yarn
yarn instal
pm2 startOrRestart yarn run watch

echo "Deployment complete."