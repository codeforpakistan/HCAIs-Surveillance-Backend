set -e

echo "Deploying the application ..."
source ~/.nvm/nvm.sh
nvm use stable
echo "Installing dependencies"
yarn install
echo "Running the application"
pm2 startOrRestart yarn --name api -- watch

echo "Deployment complete."
