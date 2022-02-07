set -e

echo "Deploying the application ..."
source ~/.nvm/nvm.sh
npm install -g yarn
<<<<<<< Updated upstream
echo "Installing dependencies"
yarn install
=======
yarn instal
>>>>>>> Stashed changes
echo "Running the application"
pm2 startOrRestart yarn --name api -- watch

echo "Deployment complete."
