set -e

echo "Deploying the application ..."
source ~/.nvm/nvm.sh
npm install -g yarn
yarn instal
pm2 start yarn --name api -- watch

echo "Deployment complete."
