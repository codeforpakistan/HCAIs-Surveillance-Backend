set -e

echo "Deploying the application ..."
source ~/.nvm/nvm.sh
npm install -g yarn
yarn instal
echo "Running the application"
pm2 startOrRestart yarn --name api -- watch

echo "Deployment complete."
